import React from 'react';

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;