import getCodingSystem from './CodingSystems'
import {VaccineCoding} from './data_model'

export class Vaccine {
  public codings: VaccineCoding[]

  public constructor(
      public name: string,
      public dosesRequired: number,
      codings: VaccineCoding[] | [string, string][]
  ) {
    this.codings = codings.map(value => {
      if (Array.isArray(value))
        return {system: getCodingSystem(value[0]), code: value[1]}
      return {system: getCodingSystem(value.system), code: value.code}
    })
    
    for (const coding of this.codings) {
      Vaccine._Vaccines.set(Vaccine.codingToKey(coding), this)
    }
  }
  
  static _Vaccines: Map<string, Vaccine> = new Map<string, Vaccine>()
  
  static codingToKey(coding: VaccineCoding): string {
    return `${coding.system}-${coding.code}`
  }
  
  static get(coding: VaccineCoding): Vaccine
  
  static get(system: string, code: string): Vaccine
  
  static get(codingOrSystem: string | VaccineCoding, code?: string): Vaccine {
    if (typeof codingOrSystem === 'string')
      return Vaccine._Vaccines.get(Vaccine.codingToKey({system: codingOrSystem, code: code}))
    else
      return Vaccine._Vaccines.get(Vaccine.codingToKey(codingOrSystem))
  }
}

(<ConstructorParameters<typeof Vaccine>[]>[
  ['AstraZeneca', 2, [['snowmed', '28761000087108'], ['snowmed', '28961000087105'], ['cvx', '210']]],
  ['Moderna mRN', 2, [['snowmed', '28571000087109'], ['cvx', '207']]],
  ['Johnson & Johnson', 1, [['snowmed', '28951000087107'], ['cvx', '212']]],
  ['Novavax', 2, [['snowmed', '29171000087106'], ['cvx', '211']]],
  ['Pfizer-BioNTech mRNA', 2, [['snowmed', '28581000087106'], ['cvx', '208']]]
]).map(value => new Vaccine(...value))
