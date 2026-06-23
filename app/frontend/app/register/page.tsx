'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Waves, User, Mail, Lock } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';

export default function RegisterPage() {
  const { form, errors, loading, success, apiError, handleChange, handleSubmit } = useRegister();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.replace('/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (success) setTimeout(() => router.push('/login'), 1500);
  }, [success, router]);

  if (authLoading || user) return null;

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-12">

      {/* Logo + title */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-linear-to-br from-[#0d3b66] to-[#006994] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Waves className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#0d3b66] mb-1">Créer un compte</h1>
        <p className="text-[#006994] text-sm">Rejoignez Diving O Club et trouvez votre club de plongée</p>
      </div>

      {/* Form cards */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {success ? (
          <div className="text-center py-6">
            <p className="text-green-600 font-medium text-lg mb-2">Compte créé avec succès !</p>
            <p className="text-gray-400 text-sm">Redirection vers la connexion...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {apiError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="firstName"
                label="Prénom"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Kevin"
                icon={User}
                error={errors.firstName}
              />
              <Input
                name="lastName"
                label="Nom"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Dupont"
                icon={User}
                error={errors.lastName}
              />
            </div>

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

            <Input
              name="password"
              type="password"
              label="Mot de passe"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              hint="8 caractères min, une majuscule, un chiffre et un caractère spécial"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-[#0d3b66] to-[#006994] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Création en cours...' : 'Créer mon compte →'}
            </button>

            <p className="text-center text-xs text-gray-400">
              En créant un compte, vous acceptez nos{' '}
              <span className="text-[#006994] cursor-pointer hover:underline">conditions d&apos;utilisation</span>
              {' '}et notre{' '}
              <span className="text-[#006994] cursor-pointer hover:underline">politique de confidentialité</span>.
            </p>

          </form>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-[#006994] hover:underline font-medium">
          Se connecter
        </Link>
      </p>

    </div>
  );
}