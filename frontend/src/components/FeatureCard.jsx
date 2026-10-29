import React from 'react';

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      {/* Hexagon Icon Badge */}
      <div className="relative mb-5 flex h-14 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110 ">
        {/* Hexagon Polygon Background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-hover)]"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center text-white">
          {icon}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
