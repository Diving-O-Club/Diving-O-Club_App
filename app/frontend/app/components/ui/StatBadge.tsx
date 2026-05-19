import { LucideIcon } from 'lucide-react';

type StatBadgeProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
};

export default function StatBadge({ icon: Icon, value, label }: StatBadgeProps) {
  return (
    <div className="bg-[#f1f8fb] rounded-xl p-4">
      <div className="flex items-center gap-2 text-[#006994] mb-1">
        <Icon className="w-5 h-5" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}