type InfoCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function InfoCard({ title, children, className = '' }: InfoCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-xl ${className}`}>
      {title && <h2 className="text-xl font-bold text-[#0d3b66] mb-6">{title}</h2>}
      {children}
    </div>
  );
}