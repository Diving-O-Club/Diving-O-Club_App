'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Waves, Mail, Lock } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const { form, errors, loading, apiError, handleChange, handleSubmit } = useLogin();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.replace('/dashboard');
  }, [user, authLoading, router]);

  if (authLoading || user) return null;

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-12">

      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-linear-to-br from-[#0d3b66] to-[#006994] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Waves className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#0d3b66] mb-1">Connexion</h1>
        <p className="text-[#006994] text-sm">Accédez à votre espace Diving O Club</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <form
          onSubmit={(e) => handleSubmit(e, () => router.push('/dashboard'))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e as any, () => router.push('/dashboard'));
            }
          }}
          className="space-y-4"
        >

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {apiError}
            </div>
          )}

          <Input
            name="email"
            type="email"
            label="Adresse email"
            value={form.email}
            onChange={handleChange}
            placeholder="vous@exemple.fr"
            icon={Mail}
            error={errors.email}
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-[#0d3b66]">Mot de passe</label>
              <span className="text-xs text-[#006994] hover:underline cursor-pointer">
                Mot de passe oublié ?
              </span>
            </div>
            <Input
              name="password"
              type="password"
              label=""
              value={form.password}
              onChange={handleChange
              }
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-[#0d3b66] to-[#006994] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>

        </form>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-[#006994] hover:underline font-medium">
          Créer un compte
        </Link>
      </p>

    </div>
  );
}