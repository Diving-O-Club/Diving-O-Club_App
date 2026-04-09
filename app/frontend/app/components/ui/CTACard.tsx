import Link from 'next/link';

type CTAButton = {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
};

type CTACardProps = {
  title: string;
  description: string;
  buttons: CTAButton[];
  variant?: 'dark' | 'light';
  className?: string;
};

export default function CTACard({ title, description, buttons, variant = 'dark', className = '' }: CTACardProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`
      rounded-2xl p-8 text-center border
      ${isDark
        ? 'bg-linear-to-br from-[#0d3b66] to-[#1b6ca8] border-transparent shadow-xl'
        : 'bg-linear-to-br from-[#f1f8fb] to-[#caf0f8] border-[#a8dadc]'
      }
      ${className}
    `}>
      <h3 className={`text-xl md:text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#0d3b66]'}`}>
        {title}
      </h3>
      <p className={`mb-6 max-w-2xl mx-auto ${isDark ? 'text-white/80' : 'text-gray-500'}`}>
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {buttons.map((btn) => (
          <Link
            key={btn.label}
            href={btn.href}
            className={
              btn.variant === 'primary'
                ? isDark
                  ? 'bg-white text-[#0d3b66] font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors'
                  : 'inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#0d3b66] to-[#006994] text-white rounded-lg hover:shadow-lg transition-all'
                : 'border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors'
            }
          >
            {btn.label}
          </Link>
        ))}
      </div>
    </div>
  );
}