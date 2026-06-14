'use client'

import { SectionTitle, ReadonlyField, InputField, CustomSelect } from '@/app/components/ui/form-fields'
import { UpdateUserDto } from '@/app/types/user'

const MONTHS = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
]

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: String(i + 1),
}))

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return ''
  // T12:00:00 évite les décalages de fuseau horaire
  return new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00`).toLocaleDateString('fr-FR')
}


type Props = {
  isEditing: boolean
  form: UpdateUserDto
  saved: UpdateUserDto
  errors: Partial<Record<keyof UpdateUserDto, string>>
  birthParts: { day: string; month: string; year: string }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBirthPartChange: (part: 'day' | 'month' | 'year', value: string) => void
}

export function PersonalInfoSection({ isEditing, form, saved, errors, birthParts, onChange, onBirthPartChange }: Props) {
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

            {/* Date de naissance — 3 champs séparés */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs text-gray-500">Date de naissance</label>
              <div className="flex gap-2">
                <div className="w-20">
                  <CustomSelect
                    value={birthParts.day}
                    onValueChange={(v) => onBirthPartChange('day', v)}
                    options={DAYS}
                    placeholder="Jour"
                    panelClassName=""
                  />
                </div>
                <div className="flex-1">
                  <CustomSelect
                    value={birthParts.month}
                    onValueChange={(v) => onBirthPartChange('month', v)}
                    options={MONTHS}
                    placeholder="Mois"
                  />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={birthParts.year}
                  onChange={(e) => onBirthPartChange('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Année"
                  maxLength={4}
                  className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none min-h-11 focus:border-[#3DA9FC] focus:ring-2 focus:ring-[#3DA9FC]/20 hover:border-gray-300 transition"
                />
              </div>
            </div>

            <div className="sm:col-span-2 border-t border-gray-100 pt-4 mt-2">
              <span className="text-xs text-[#0D3B66] font-semibold uppercase tracking-wider">Adresse</span>
            </div>
            <InputField
              label="Rue"
              name="street"
              value={form.street ?? ''}
              onChange={onChange}
              error={errors.street}
              placeholder="12 rue des Coraux"
            />
            <InputField
              label="Code postal"
              name="postalCode"
              value={form.postalCode ?? ''}
              onChange={onChange}
              error={errors.postalCode}
              placeholder="13008"
            />
            <InputField
              label="Ville"
              name="city"
              value={form.city ?? ''}
              onChange={onChange}
              error={errors.city}
              placeholder="Marseille"
            />
          </>
        ) : (
          <>
            <ReadonlyField label="Prénom" value={saved.firstName} />
            <ReadonlyField label="Nom" value={saved.lastName} />
            <ReadonlyField label="Email" value={saved.email} />
            <ReadonlyField label="Téléphone" value={saved.phone} />
            <ReadonlyField label="Date de naissance" value={formatDate(saved.birthDate)} />
            <div className="sm:col-span-2 border-t border-gray-100 pt-4 mt-2">
              <span className="text-xs text-[#0D3B66] font-semibold uppercase tracking-wider">Adresse</span>
            </div>
            <ReadonlyField label="Rue" value={saved.street} />
            <ReadonlyField label="Code postal" value={saved.postalCode} />
            <ReadonlyField label="Ville" value={saved.city} />
          </>
        )}
      </div>
    </div>
  )
}
