'use client'

import { SectionTitle, ReadonlyField, InputField } from '@/app/components/ui/form-fields'
import { UpdateUserDto } from '@/app/types/user'

type Props = {
  isEditing: boolean
  form: UpdateUserDto
  saved: UpdateUserDto
  errors: Partial<Record<keyof UpdateUserDto, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

export function PersonalInfoSection({ isEditing, form, saved, errors, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
      <SectionTitle>Informations personnelles</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isEditing ? (
          <>
            <InputField
              label="Prénom"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              error={errors.firstName}
              required
            />
            <InputField
              label="Nom"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              error={errors.lastName}
              required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              error={errors.email}
              required
            />
            <InputField
              label="Téléphone"
              name="phone"
              type="tel"
              value={form.phone ?? ''}
              onChange={onChange}
              error={errors.phone}
              placeholder="06 12 34 56 78"
            />
            <InputField
              label="Date de naissance"
              name="birthDate"
              type="date"
              value={form.birthDate ?? ''}
              onChange={onChange}
            />
            <div className="sm:col-span-2">
              <InputField
                label="Adresse"
                name="address"
                value={form.address ?? ''}
                onChange={onChange}
                placeholder="12 rue des Coraux, 13008 Marseille"
              />
            </div>
          </>
        ) : (
          <>
            <ReadonlyField label="Prénom" value={saved.firstName} />
            <ReadonlyField label="Nom" value={saved.lastName} />
            <ReadonlyField label="Email" value={saved.email} />
            <ReadonlyField label="Téléphone" value={saved.phone} />
            <ReadonlyField label="Date de naissance" value={formatDate(saved.birthDate)} />
            <div className="sm:col-span-2">
              <ReadonlyField label="Adresse" value={saved.address} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
