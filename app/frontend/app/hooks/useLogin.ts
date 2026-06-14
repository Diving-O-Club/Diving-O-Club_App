import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, checkAuth } from '@/app/lib/api/auth';

type LoginForm = { email: string; password: string };
type FormErrors = Partial<Record<keyof LoginForm, string>>;

export function useLogin() {
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "L'email n'est pas valide";
    if (!form.password) newErrors.password = 'Le mot de passe est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (!res.ok) {
        setApiError(res.message || 'Identifiants incorrects');
        return;
      }
      const user = await checkAuth();
      if (user) login(user);
      onSuccess();
    } catch {
      setApiError('Impossible de contacter le serveur');
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, loading, apiError, handleChange, handleSubmit };
}
