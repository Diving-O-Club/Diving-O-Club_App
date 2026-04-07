type StatCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

export default function StatCard({
  icon: Icon,
  label,
  value,
}: StatCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/15">
        <Icon className="w-6 h-6 text-white" />
      </div>

      <div>
        <p className="text-white/70 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}