import Link from 'next/link';
import { MapPin, Users, ArrowRight, CheckCircle } from 'lucide-react';

type ClubCardProps = {
  name: string;
  city: string;
  slug: string;
};

export default function ClubCard({ name, city, slug }: ClubCardProps) {
  return (
    <Link
      href={`/clubs/${slug}`}
      className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-[#0d3b66] text-lg mb-2 group-hover:text-[#006994] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{city}</span>
          </div>
        </div>
        <div className="bg-green-100 text-green-700 p-2 rounded-lg shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>
      </div>

    </Link>
  );
}