'use client'

import { useState } from 'react'
import { changePassword } from '@/app/lib/api/user'

type Props = {
  onClose: () => void
  onSuccess: () => void
}

type Rules = {
  length: boolean
  lower: boolean
  upper: boolean
  digit: boolean
  special: boolean
  match: boolean
}

function checkRules(password: string, confirm: string): Rules {
  return {
    length:  password.length >= 8,
    lower:   /[a-z]/.test(password),
    upper:   /[A-Z]/.test(password),
    digit:   /\d/.test(password),
    special: /[\W_]/.test(password),
    match:   password.length > 0 && password === confirm,
  }
}

const INDICATORS: { key: keyof Rules; label: string }[] = [
  { key: 'length',  label: 'Au moins 8 caractères' },
  { key: 'upper',   label: 'Au moins une majuscule' },
  { key: 'lower',   label: 'Au moins une minuscule' },
  { key: 'digit',   label: 'Au moins un chiffre' },
  { key: 'special', label: 'Au moins un caractère spécial' },
  { key: 'match',   label: 'Les mots de passe correspondent' },
]

export function ChangePasswordModal({ onClose, onSuccess }: Props) {
  const [current, setCurrent]   = useState('')
  const [newPwd, setNewPwd]     = useState('')
  const [confirm, setConfirm]   = useState('')
  const [wrongCurrent, setWrongCurrent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const rules = checkRules(newPwd, confirm)
  const allValid = current.trim().length > 0 && Object.values(rules).every(Boolean)

  async function handleSubmit() {
    if (!allValid) return
    setIsSubmitting(true)
    setWrongCurrent(false)
    const result = await changePassword(current, newPwd)
    setIsSubmitting(false)
    if (result.wrongCurrent) {
      setWrongCurrent(true)
      return
    }
    onSuccess()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0D3B66]">Changer le mot de passe</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Champ mot de passe actuel */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Mot de passe actuel</label>
          <input
            type="password"
            value={current}
            onChange={(e) => { setCurrent(e.target.value); setWrongCurrent(false) }}
            className={`rounded-lg border px-4 py-3 text-sm text-gray-800 outline-none transition min-h-11
              focus:border-[#3DA9FC] focus:ring-2 focus:ring-[#3DA9FC]/20
              ${wrongCurrent ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            placeholder="••••••••"
          />
          {wrongCurrent && (
            <p className="text-xs text-red-500 mt-0.5">Mot de passe actuel incorrect</p>
          )}
        </div>

        {/* Nouveau mot de passe */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Nouveau mot de passe</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition min-h-11
              focus:border-[#3DA9FC] focus:ring-2 focus:ring-[#3DA9FC]/20 hover:border-gray-300"
            placeholder="••••••••"
          />
        </div>

        {/* Confirmation */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition min-h-11
              focus:border-[#3DA9FC] focus:ring-2 focus:ring-[#3DA9FC]/20 hover:border-gray-300"
            placeholder="••••••••"
          />
        </div>

        {/* Indicateurs */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Exigences</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {INDICATORS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${rules[key] ? 'bg-[#2EC4B6]' : 'bg-red-400'}`} />
                <span className={`text-xs transition-colors ${rules[key] ? 'text-[#2EC4B6]' : 'text-red-500'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={handleSubmit}
          disabled={!allValid || isSubmitting}
          className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition
            ${allValid && !isSubmitting
              ? 'bg-[#2EC4B6] text-white hover:bg-[#28b0a3]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isSubmitting ? 'Enregistrement...' : 'Modifier le mot de passe'}
        </button>

      </div>
    </div>
  )
}
