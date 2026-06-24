'use client'

import { useState } from 'react'
import { Trash2, X, Download } from 'lucide-react'

type Props = {
  onClose: () => void
  onConfirm: () => void
  onDownload: () => void
  loading: boolean
}

export function DeleteAccountModal({ onClose, onConfirm, onDownload, loading }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Fermer"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#0d3b66] mb-2">Supprimer mon compte</h2>
          {step === 1 ? (
            <p className="text-sm text-gray-500 leading-relaxed">
              Cette action est définitive. Vos informations personnelles (identité,
              coordonnées, profil de plongée) ainsi que vos certificats médicaux seront
              supprimés. Vos adhésions et inscriptions resteront enregistrées dans les
              clubs concernés, mais dissociées de votre identité.
            </p>
          ) : (
            <p className="text-sm text-gray-500 leading-relaxed">
              Dernière étape : confirmez la suppression définitive de votre compte.
            </p>
          )}
        </div>

        {step === 1 && (
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#3DA9FC] bg-[#e8f4ff] px-5 py-2.5 text-sm font-medium text-[#0D3B66] hover:bg-[#d0eaff] transition"
          >
            <Download className="w-4 h-4" />
            Télécharger mes données avant de partir
          </button>
        )}

        {step === 2 && (
          <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
            />
            <span>Je comprends que cette action est irréversible.</span>
          </label>
        )}

        <div className="flex gap-3">
          <button
            onClick={step === 1 ? onClose : () => setStep(1)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {step === 1 ? 'Annuler' : 'Retour'}
          </button>
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Continuer
            </button>
          ) : (
            <button
              onClick={onConfirm}
              disabled={!confirmed || loading}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Suppression...' : 'Supprimer définitivement mon compte'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
