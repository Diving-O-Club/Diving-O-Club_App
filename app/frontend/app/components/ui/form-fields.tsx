'use client'

// ─── SectionTitle ─────────────────────────────────────────────────────────────

type SectionTitleProps = {
  children: React.ReactNode
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-sm font-semibold text-[#0D3B66] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
      {children}
    </h2>
  )
}

// ─── ReadonlyField ────────────────────────────────────────────────────────────

type ReadonlyFieldProps = {
  label: string
  value: string | null | undefined
}

export function ReadonlyField({ label, value }: ReadonlyFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 min-h-11 flex items-center">
        {value || <span className="text-gray-400 italic">Non renseigné</span>}
      </div>
    </div>
  )
}

// ─── InputField ───────────────────────────────────────────────────────────────

type InputFieldProps = {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  placeholder?: string
}

export function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required,
  placeholder,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded-lg border px-4 py-3 text-sm text-gray-800 outline-none transition min-h-11
          focus:border-[#3DA9FC] focus:ring-2 focus:ring-[#3DA9FC]/20
          ${error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  )
}

// ─── SelectField ──────────────────────────────────────────────────────────────

type SelectOption = {
  value: string
  label: string
}

type SelectGroup = {
  label: string
  options: SelectOption[]
}

type SelectFieldProps = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  groups?: SelectGroup[]
  options?: SelectOption[]
  placeholder?: string
  hint?: string
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  groups,
  options,
  placeholder = '— Non renseigné —',
  hint,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none min-h-11
          focus:border-[#3DA9FC] focus:ring-2 focus:ring-[#3DA9FC]/20 hover:border-gray-300 transition"
      >
        <option value="">{placeholder}</option>

        {groups?.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}

        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && (
        <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
      )}
    </div>
  )
}
