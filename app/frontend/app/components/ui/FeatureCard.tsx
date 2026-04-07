import React from 'react';

type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group">
      <div className="bg-linear-to-br from-[#0d3b66] to-[#006994] p-4 rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-lg mb-2 text-[#0d3b66]">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}