'use client'

import { SectionTitle } from '@/app/components/ui/form-fields'

type Props = {
  onDownload: () => void
  onDeleteRequest: () => void
}

export function RgpdSection({ onDownload, onDeleteRequest }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <SectionTitle>Confidentialité &amp; données personnelles</SectionTitle>

      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
        rectification et d&apos;effacement de vos données personnelles. Consultez
        notre{' '}
        <a
          href="/confidentialite"
          className="text-[#3DA9FC] underline underline-offset-2 hover:text-[#0D3B66] transition"
        >
          politique de confidentialité
        </a>{' '}
        pour en savoir plus.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#3DA9FC] bg-[#e8f4ff] px-5 py-2.5 text-sm font-medium text-[#0D3B66] hover:bg-[#d0eaff] transition"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger mes données
        </button>

        <button
          onClick={onDeleteRequest}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-[#B71C1C] hover:bg-red-100 transition"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
