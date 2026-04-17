'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, Settings } from 'lucide-react';

const LINKS = [
  { href: '/dashboard',         label: 'Accueil',    Icon: Home },
  { href: '/dashboard/members', label: 'Membres',    Icon: Users },
  { href: '/dashboard/events',  label: 'Événements', Icon: Calendar },
  { href: '/profile',           label: 'Profil',     Icon: Settings },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {LINKS.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-[#0d3b66] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}