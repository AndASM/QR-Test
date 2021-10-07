import {ImmunizationResource} from "./data_model";


const codingSystems: {[system: string]: {[code: number]: string}} = {
    'http://hl7.org/fhir/sid/cvx': {
        207: "Moderna",
        208: "Pfizer",
        210: "AstraZeneca",
        212: "Janssen"
    }
}


class Immunization {
    data: ImmunizationResource

    constructor(data: ImmunizationResource) {
        this.data = data
    }

    get name() {
        for (const value of this.data.vaccineCode.coding) {
            const name = codingSystems?.[value.system]?.[parseInt(value.code, 10)]
            if (name) return name
        }
        return null
    }
}
