import {PatientResource} from "./data_model";

export default class Patient {
    data: PatientResource

    public constructor(data: PatientResource) {
        this.data = data
    }

    public get firstName() {
        return this.data.name[0].given.join(' ')
    }

    public get lastName() {
        return this.data.name[0].family
    }

    public get fullName() {
        return `${this.firstName} ${this.lastName}`
    }
}
