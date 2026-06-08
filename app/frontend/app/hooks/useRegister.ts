import { useState } from 'react';
import { registerUser } from '@/app/lib/api/auth';

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
type FormErrors = Partial<Record<keyof RegisterForm, string>>;

export function useRegister() {
  const [form, setForm] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!form.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "L'email n'est pas valide";
    if (!form.password) newErrors.password = 'Le mot de passe est requis';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(form.password))
      newErrors.password =
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registerUser(form);
      if (!res.ok) {
        setApiError(res.message || 'Une erreur est survenue');
        return;
      }
      setSuccess(true);
    } catch {
      setApiError('Impossible de contacter le serveur');
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, loading, success, apiError, handleChange, handleSubmit };
}
