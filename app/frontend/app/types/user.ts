import { DivingLevel, InstructorLevel } from '@/app/types/enums'

export type User = {
  idUser: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  birthDate: string | null
  address: string | null
  ffessmLicenseNumber: string | null
  divingLevel: DivingLevel | null
  instructorLevel: InstructorLevel | null
  profilePictureUrl: string | null
  createdAt: string
}

export type UpdateUserDto = {
  firstName: string
  lastName: string
  email: string
  phone: string | null
  birthDate: string | null
  address: string | null
  ffessmLicenseNumber: string | null
  divingLevel: DivingLevel | null
  instructorLevel: InstructorLevel | null
}