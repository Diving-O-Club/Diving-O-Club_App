'use client'

import { SectionTitle, ReadonlyField, InputField, SelectField } from '@/app/components/ui/form-fields'
import {
  DivingLevel,
  InstructorLevel,
  DIVING_LEVEL_LABELS,
  INSTRUCTOR_LEVEL_LABELS,
} from '@/app/types/enums'
import { UpdateUserDto } from '@/app/types/user'

const DIVING_LEVEL_GROUPS = [
  {
    label: 'Jeunes plongeurs',
    options: [
      { value: DivingLevel.BRONZE, label: 'Plongeur Bronze' },
      { value: DivingLevel.ARGENT, label: 'Plongeur Argent' },
      { value: DivingLevel.OR_12, label: 'Plongeur Or 12m' },
      { value: DivingLevel.OR_20, label: 'Plongeur Or 20m' },
    ],
  },
  {
    label: 'Plongeurs encadrés / autonomes',
    options: [
      { value: DivingLevel.PE_12, label: 'PE-12 — Encadré 12m' },
      { value: DivingLevel.N1, label: 'N1 — Encadré 20m' },
      { value: DivingLevel.PA_12, label: 'PA-12 — Autonome 12m' },
      { value: DivingLevel.PA_20, label: 'PA-20 — Autonome 20m' },
      { value: DivingLevel.PE_40, label: 'PE-40 — Encadré 40m' },
      { value: DivingLevel.N2, label: 'N2 — Autonome 20m + Encadré 40m' },
      { value: DivingLevel.PE_60, label: 'PE-60 — Encadré 60m' },
      { value: DivingLevel.PA_40, label: 'PA-40 — Autonome 40m' },
      { value: DivingLevel.N3, label: 'N3 — Autonome 60m' },
    ],
  },
]

const INSTRUCTOR_LEVEL_OPTIONS = [
  { value: InstructorLevel.N4, label: 'N4 — Guide de Palanquée' },
  { value: InstructorLevel.E1, label: 'E1 — Initiateur' },
  { value: InstructorLevel.E2, label: 'E2 — Initiateur + Guide de Palanquée' },
  { value: InstructorLevel.MF1, label: 'MF1 — Moniteur Fédéral 1er degré' },
  { value: InstructorLevel.MF2, label: 'MF2 — Moniteur Fédéral 2ème degré' },
  { value: InstructorLevel.N5, label: 'N5 — Directeur de Plongée Exploration' },
]

type Props = {
  isEditing: boolean
  form: UpdateUserDto
  saved: UpdateUserDto
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function SportsInfoSection({ isEditing, form, saved, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
      <SectionTitle>Informations sportives</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isEditing ? (
          <>
            <div className="sm:col-span-2">
              <InputField
                label="Numéro de licence FFESSM"
                name="ffessmLicenseNumber"
                value={form.ffessmLicenseNumber ?? ''}
                onChange={onChange}
                placeholder="A-123456"
              />
            </div>
            <SelectField
              label="Niveau plongeur"
              name="divingLevel"
              value={form.divingLevel ?? ''}
              onChange={onChange}
              groups={DIVING_LEVEL_GROUPS}
            />
            <SelectField
              label="Qualification d'encadrement"
              name="instructorLevel"
              value={form.instructorLevel ?? ''}
              onChange={onChange}
              options={INSTRUCTOR_LEVEL_OPTIONS}
              placeholder="— Aucune —"
              hint="Optionnel — indépendant du niveau plongeur (ex : N2 + E1)"
            />
          </>
        ) : (
          <>
            <div className="sm:col-span-2">
              <ReadonlyField
                label="Numéro de licence FFESSM"
                value={saved.ffessmLicenseNumber}
              />
            </div>
            <ReadonlyField
              label="Niveau plongeur"
              value={saved.divingLevel ? DIVING_LEVEL_LABELS[saved.divingLevel] : null}
            />
            <ReadonlyField
              label="Qualification d'encadrement"
              value={saved.instructorLevel ? INSTRUCTOR_LEVEL_LABELS[saved.instructorLevel] : null}
            />
          </>
        )}
      </div>
    </div>
  )
}
