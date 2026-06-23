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

// A password input bundled with a show/hide eye toggle.
// Styling is left to the caller through `className` so it fits any form chrome.
export default function PasswordField({
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  className,
  toggleClassName = 'hover:text-[#006994]',
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${toggleClassName}`}
        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        aria-pressed={show}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
