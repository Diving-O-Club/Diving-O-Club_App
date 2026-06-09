'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { getMe, updateMe, exportMyData } from '@/app/lib/user'
import { User } from '@/app/types/user'
import { UpdateUserDto } from '@/app/types/user'
import { PersonalInfoSection } from '@/app/components/profile/PersonalInfoSection'
import { SportsInfoSection } from '@/app/components/profile/SportsInfoSection'
import { RgpdSection } from '@/app/components/profile/RgpdSection'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function userToForm(user: User): UpdateUserDto {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    birthDate: user.birthDate,
    street: user.street,
    postalCode: user.postalCode,
    city: user.city,
    ffessmLicenseNumber: user.ffessmLicenseNumber,
    divingLevel: user.divingLevel,
    instructorLevel: user.instructorLevel,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user: authUser, loading } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<User | null>(null)
  const [form, setForm] = useState<UpdateUserDto | null>(null)
  const [saved, setSaved] = useState<UpdateUserDto | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserDto, string>>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [navHeight, setNavHeight] = useState(68)

  useEffect(() => {
    const nav = document.querySelector('nav')
    if (!nav) return
    const update = () => setNavHeight(nav.getBoundingClientRect().height)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [])

  // Redirection when not authenticated
  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login')
    }
  }, [authUser, loading, router])

  // Loading the complete profile via GET /me
  useEffect(() => {
    if (!authUser) return
    getMe().then((data) => {
      if (!data) return
      setProfile(data)
      const formData = userToForm(data)
      setForm(formData)
      setSaved(formData)
    })
  }, [authUser])

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => prev ? { ...prev, [name]: value || null } : prev)
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function validate(): boolean {
    if (!form) return false
    const newErrors: Partial<Record<keyof UpdateUserDto, string>> = {}

    if (!form.firstName?.trim()) newErrors.firstName = 'Le prénom est requis'
    if (!form.lastName?.trim()) newErrors.lastName = 'Le nom est requis'

    if (!form.email?.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (form.phone && !/^(\+33|0)[1-9](\d{2}){4}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide'
    }

    if (form.ffessmLicenseNumber && !/^[A-Z]-\d{2}-\d{6}$/i.test(form.ffessmLicenseNumber)) {
      newErrors.ffessmLicenseNumber = 'Format invalide (ex : A-01-000001)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSave() {
    if (!form || !validate()) return
    setIsSaving(true)
    try {
      const updated = await updateMe(form)
      if (!updated) throw new Error()
      const newForm = userToForm(updated)
      setProfile(updated)
      setSaved(newForm)
      setForm(newForm)
      setIsEditing(false)
      showToast('success', 'Profil mis à jour avec succès')
    } catch {
      showToast('error', 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleCancel() {
    if (saved) setForm(saved)
    setErrors({})
    setIsEditing(false)
  }

  async function handleDownload() {
    try {
      const blob = await exportMyData()
      if (!blob) throw new Error()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mes-donnees-diving-o-club-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('success', 'Vos données ont été téléchargées')
    } catch {
      showToast('error', "Impossible de générer l'export. Veuillez réessayer.")
    }
  }

  function handleDeleteRequest() {
    // TODO : open the deletion modal
  }

  // ─── Loading states ───────────────────────────────────────────────────

  if (loading || !profile || !form || !saved) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    )
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-linear-to-b from-[#e8f4ff] to-white">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-lg text-sm font-medium
          ${toast.type === 'success' ? 'bg-[#2EC4B6] text-white' : 'bg-[#B71C1C] text-white'}`}
        >
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div
          className={`flex items-center justify-between mb-8 transition-all ${
            isEditing
              ? 'sticky z-40 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 rounded-b-xl'
              : ''
          }`}
          style={isEditing ? { top: navHeight } : undefined}
        >
          <h1 className="text-2xl font-semibold text-[#0D3B66]">Mon Profil</h1>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg border border-[#3DA9FC] bg-white px-4 py-2 text-sm font-medium text-[#0D3B66] hover:bg-[#e8f4ff] transition"
            >
              Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-[#0D3B66] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a2f52] disabled:opacity-60 transition"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#0D3B66] flex items-center justify-center text-white text-2xl font-semibold select-none">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#1F2933]">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <PersonalInfoSection
          isEditing={isEditing}
          form={form}
          saved={saved}
          errors={errors}
          onChange={handleChange}
        />

        <SportsInfoSection
          isEditing={isEditing}
          form={form}
          saved={saved}
          onChange={handleChange}
        />

        <RgpdSection
          onDownload={handleDownload}
          onDeleteRequest={handleDeleteRequest}
        />

      </div>

    </div>
  )
}
