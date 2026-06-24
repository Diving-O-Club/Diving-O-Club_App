'use client';

import { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

type PasswordFieldProps = {
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: LucideIcon;
  className?: string;
  toggleClassName?: string;
};

// A password input paired with a show/hide toggle placed *next to* the field
// (not overlaid) so the eye button keeps its own tap target on touch screens.
// Styling is left to the caller through `className` / `toggleClassName`.
export default function PasswordField({
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  className,
  toggleClassName = 'rounded-xl border border-gray-200 hover:text-[#006994] hover:border-gray-300',
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-stretch gap-2">
      <div className="relative flex-1">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
        />
      </div>
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className={`shrink-0 flex items-center justify-center px-3.5 text-gray-400 transition-colors ${toggleClassName}`}
        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        aria-pressed={show}
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}
