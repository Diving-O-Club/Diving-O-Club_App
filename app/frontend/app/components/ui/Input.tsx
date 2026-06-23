import { LucideIcon } from 'lucide-react';
import PasswordField from './PasswordField';

type InputProps = {
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  label: string;
};

export default function Input({ name, type = 'text', value, onChange, placeholder, icon: Icon, error, hint, label }: InputProps) {
  const isPassword = type === 'password';
  const inputClassName = `w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] ${error ? 'border-red-400' : 'border-gray-200'}`;

  return (
    <div>
      <label className="block text-sm font-medium text-[#0d3b66] mb-1">{label}</label>
      {isPassword ? (
        <PasswordField
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          icon={Icon}
          className={inputClassName}
        />
      ) : (
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClassName}
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
    </div>
  );
}
