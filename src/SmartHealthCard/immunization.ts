import {ImmunizationResource} from './data_model'
import {Vaccine} from './vaccine'

export default class Immunization {
  data: ImmunizationResource
  vaccine: Vaccine
  
  public constructor(data: ImmunizationResource) {
    this.data = data
    this.data.vaccineCode.coding.find(value => {
      this.vaccine = Vaccine.get(value)
      return this.vaccine !== undefined
    })
  }
  
  get name() {
    return this.vaccine?.name
  }
  
  get amountImmunized() {
    return 1.0 / this.vaccine?.dosesRequired
  }
}
