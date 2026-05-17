import { User, UpdateUserDto } from '@/app/types/user'

export async function getMe(): Promise<User | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      cache: 'no-store',
      credentials: 'include',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function updateMe(data: UpdateUserDto): Promise<User | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function exportMyData(): Promise<Blob | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/export`, {
      cache: 'no-store',
      credentials: 'include',
    })
    if (!res.ok) return null
    return res.blob()
  } catch {
    return null
  }
}
