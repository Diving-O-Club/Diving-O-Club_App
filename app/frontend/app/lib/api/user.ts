import { User, UpdateUserDto } from '@/app/types/user';
import { clientFetch } from '../clientFetch';

export async function getMe(): Promise<User | null> {
  try {
    const res = await clientFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      cache: 'no-store',
      credentials: 'include',
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function updateMe(data: UpdateUserDto): Promise<User | null> {
  try {
    const res = await clientFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function exportMyData(): Promise<Blob | null> {
  try {
    const res = await clientFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/export`, {
      cache: 'no-store',
      credentials: 'include',
    });
    return res.ok ? res.blob() : null;
  } catch {
    return null;
  }
}
