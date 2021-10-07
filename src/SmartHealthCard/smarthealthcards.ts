import {compactVerify} from 'jose/jws/compact/verify'
import pako from 'pako'
import {Base64} from 'js-base64'
import {getKnownIssuers} from "./knownissuers"
import {ImmunizationResource, PatientResource, Payload} from "./data_model";
import Patient from './patient'

export class SmartHealthCard {
    jws: string
    header: object
    verified: boolean

    constructor(uri: string) {
        const {jws, header, payload} = SmartHealthCard.parseShcUri(uri)
        this.jws = jws
        this.header = header
        this.payload = payload
        this.verified = false
    }

    protected _payload: Payload

    get payload() {
        return this._payload
    }

    protected set payload(value) {
        this._payload = value
        this._patient = null
    }

    protected _patient: Patient

    get patient(): Patient {
        if (!this._patient)
            this._patient = new Patient(<PatientResource>this.entries
                .find((value) => value.resource.resourceType === 'Patient')
                .resource
            )
        return this._patient
    }

    get immunizations() {
        return this.entries
            .filter((value) => value.resource.resourceType === 'Immunization')
            .map(value => <ImmunizationResource>value.resource)
    }

    protected get entries() {
        return this.payload.vc.credentialSubject.fhirBundle.entry
    }

    static async build(uri: string): Promise<SmartHealthCard> {
        const obj = new SmartHealthCard(uri)
        await obj.doVerify()
        return obj
    }

    static parseShcUri(uri: string) {
        const shcParts = uri.match(/([^:]*):\/([^:\/]*)/) || []
        if (shcParts.length <= 0)
            throw new Error('Couldn\'t parse Smart Health Card data')
        if (shcParts[1] !== 'shc')
            throw new Error(`Expected shc protocol, got ${shcParts[0]}`)

        const jwt = SmartHealthCard.parseNumericChunk(shcParts[2])
        const [rawHeader, rawPayload] = jwt.split('.').map(Base64.toUint8Array)
        const header = JSON.parse(new TextDecoder().decode(rawHeader))
        const payload = JSON.parse(('zip' in header) ? pako.inflateRaw(rawPayload, {to: "string"}) : new TextDecoder().decode(rawPayload))
        return {jws: jwt, header, payload}
    }

    // No plans currently to properly handle chunked QR codes.
    static parseNumericChunk(numericData: string): string {
        // https://spec.smarthealth.cards/#encoding-chunks-as-qr-codes
        const shcCodes = numericData.match(/(\d\d?)/g) // Get two digits
        const characterCodes = shcCodes.map((code) => parseInt(code, 10) + 45) // add 45
        return String.fromCharCode(...characterCodes)
    }

    async doVerify() {
        try {
            const verifyResult = await compactVerify(this.jws, await getKnownIssuers((this.payload as any).iss as string))
            this.verified = verifyResult != null
        } catch {
            this.verified = false
        }
    }
}
