// @ts-ignore
import {compactVerify} from 'jose/dist/browser/jws/compact/verify'
import pako from 'pako'
import {Base64} from 'js-base64'
import {getKnownIssuers} from "./knownissuers"
import {JWTPayload} from 'jose/types'

interface PatientName {
    family: string
    given: string[]
}
interface PatientResource {
    resourceType: 'Patient'
    name: PatientName[]
    birthDate: string
}

interface ImmunizationResource {
    resourceType: 'Immunization'
    meta: object
    status: string
    vaccineCode: {
        coding: {
            system: string
            code: string
        }[]
    }
    patient: {
        reference: string
    }
    occurrenceDateTime: string
    performer: object[]
    lotNumber: string
}

type FhirResource = PatientResource | ImmunizationResource

interface FhirEntry {
    fullUrl: string
    resource: FhirResource
}

interface FhirBundle {
    resourceType: string
    type: string
    entry: FhirEntry[]
}

interface VerifiedCredential {
    type: string[]
    credentialSubject: {
        fhirVersion: string
        fhirBundle: FhirBundle
    }
}

interface Payload extends JWTPayload {
    iss: string
    nbf: number
    vc: VerifiedCredential
}

export class SmartHealthCard {
    jws: string
    header: object
    payload: Payload
    verified: boolean

    get patientName(): string {
        return (<PatientResource>this.payload.vc.credentialSubject.fhirBundle.entry[0].resource).name[0].family
    }

    constructor(uri: string) {
        const {jws, header, payload} = SmartHealthCard.parseShcUri(uri)
        this.jws = jws
        this.header = header
        this.payload = payload
        this.verified = false
    }

    public static async build(uri: string): Promise<SmartHealthCard> {
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
