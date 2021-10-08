const _codingSystemNames: [string, string][] = [
  ['cvx', 'http://hl7.org/fhir/sid/cvx'],
  ['snomed', 'http://snomed.info/sct']
]

export const codingSystems = new Set<string>(
    _codingSystemNames.map(value => value[1])
)

export const codingSystemNames = new Map<string, string>(_codingSystemNames)

export default function getCodingSystem(name: string) {
  if (codingSystems.has(name))
    return name
  else
    return codingSystemNames.get(name)
}
