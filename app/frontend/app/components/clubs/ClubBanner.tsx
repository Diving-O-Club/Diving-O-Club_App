import { Shield } from 'lucide-react';

type ClubBannerProps = {
  name: string;
  city: string;
  status: string;
};

export default function ClubBanner({ name, city, status }: ClubBannerProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-6">
      <div className="h-48 md:h-56 bg-linear-to-br from-[#0d3b66] via-[#006994] to-[#48cae4] flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl">
          <Shield className="w-16 h-16 md:w-20 md:h-20 text-white" />
        </div>
      </div>
      <div className="px-6 md:px-8 pt-6 pb-2">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-[#0d3b66]">{name}</h1>
          {status === 'active' && (
            <span className="bg-green-100 text-green-700 text-sm px-3 py-0.5 rounded-full">Actif</span>
          )}
        </div>
        <p className="text-gray-500 text-sm">{city}, France</p>
      </div>
    </div>
  );
}