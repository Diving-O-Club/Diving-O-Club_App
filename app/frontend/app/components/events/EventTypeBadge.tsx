import { Waves, BookOpen, GraduationCap, Dumbbell, PartyPopper } from 'lucide-react';

export const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  dive_trip:    { label: 'Sortie plongée',   color: 'bg-blue-100 text-blue-700',    icon: <Waves className="w-3 h-3" /> },
  training:     { label: 'Formation',        color: 'bg-purple-100 text-purple-700', icon: <BookOpen className="w-3 h-3" /> },
  initiation:   { label: 'Baptême',          color: 'bg-green-100 text-green-700',  icon: <GraduationCap className="w-3 h-3" /> },
  pool_session: { label: 'Séance piscine',   color: 'bg-cyan-100 text-cyan-700',    icon: <Dumbbell className="w-3 h-3" /> },
  social:       { label: 'Événement social', color: 'bg-orange-100 text-orange-700', icon: <PartyPopper className="w-3 h-3" /> },
};

type Props = {
  eventType: string;
};

export default function EventTypeBadge({ eventType }: Props) {
  const config = EVENT_TYPE_CONFIG[eventType];

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${config?.color ?? 'bg-gray-100 text-gray-500'}`}>
      {config?.icon}
      {config?.label ?? eventType}
    </span>
  );
}