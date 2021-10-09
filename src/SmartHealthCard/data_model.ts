import {JWTPayload} from 'jose/types'

interface PatientName {
  family: string
  given: string[]
}

export interface PatientResource {
  resourceType: 'Patient'
  name: PatientName[]
  birthDate: string
}

export interface VaccineCoding {
  system: string
  code: string
}

export interface ImmunizationResource {
  resourceType: 'Immunization'
  meta: object
  status: string
  vaccineCode: {
    coding: VaccineCoding[]
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

export interface Payload extends JWTPayload {
  iss: string
  nbf: number
  vc: VerifiedCredential
}
