'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'

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

// ─── CustomSelect ─────────────────────────────────────────────────────────────

type CustomSelectOption = { value: string; label: string }
type CustomSelectGroup = { label: string; options: CustomSelectOption[] }

type CustomSelectProps = {
  label?: string
  value: string
  onValueChange: (value: string) => void
  options?: CustomSelectOption[]
  groups?: CustomSelectGroup[]
  placeholder?: string
  hint?: string
  panelClassName?: string
}

export function CustomSelect({
  label,
  value,
  onValueChange,
  options = [],
  groups = [],
  placeholder = '— Non renseigné —',
  hint,
  panelClassName = 'min-w-[200px]',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [isOpen])

  const allFlat = [...options, ...groups.flatMap((g) => g.options)]
  const selectedLabel = allFlat.find((o) => o.value === value)?.label ?? null

  function select(v: string) {
    onValueChange(v)
    setIsOpen(false)
  }

  function itemClass(v: string) {
    return (
      'w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 transition cursor-pointer ' +
      (v === value ? 'text-[#0D3B66] bg-[#e8f4ff] font-medium' : 'text-gray-700 hover:bg-gray-50')
    )
  }

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      {label && <label className="text-xs text-gray-500">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm min-h-11 text-left transition bg-white
            ${isOpen ? 'border-[#3DA9FC] ring-2 ring-[#3DA9FC]/20' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <span className={selectedLabel ? 'text-gray-800' : 'text-gray-400'}>
            {selectedLabel ?? placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className={`absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden ${panelClassName}`}>
            <ul className="max-h-64 overflow-y-auto py-1">
              <li>
                <button type="button" onClick={() => select('')} className={itemClass('')}>
                  <span className="w-4 shrink-0" />
                  <span className="text-gray-400">{placeholder}</span>
                </button>
              </li>
              {options.map((opt) => (
                <li key={opt.value}>
                  <button type="button" onClick={() => select(opt.value)} className={itemClass(opt.value)}>
                    {opt.value === value ? <Check className="w-4 h-4 shrink-0" /> : <span className="w-4 shrink-0" />}
                    {opt.label}
                  </button>
                </li>
              ))}
              {groups.map((group) => (
                <li key={group.label}>
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider select-none">
                    {group.label}
                  </div>
                  <ul>
                    {group.options.map((opt) => (
                      <li key={opt.value}>
                        <button type="button" onClick={() => select(opt.value)} className={itemClass(opt.value)}>
                          {opt.value === value ? <Check className="w-4 h-4 shrink-0" /> : <span className="w-4 shrink-0" />}
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )
}
