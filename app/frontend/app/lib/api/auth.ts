export type AuthUser = {
  idUser: number;
  email: string;
  firstName: string | null;
};

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  return { ok: res.ok, message: data.message };
}

export async function registerUser(form: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  return { ok: res.ok, message: data.message };
}

export async function logoutUser(): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function checkAuth(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: 'include',
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}
