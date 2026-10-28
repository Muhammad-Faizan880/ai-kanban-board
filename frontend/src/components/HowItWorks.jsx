import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create a Project',
      description: 'Set up your project, define goals, and bring your team together.',
    },
    {
      number: '02',
      title: 'Manage the Work',
      description: 'Break projects into tasks, assign responsibilities, and track priorities.',
    },
    {
      number: '03',
      title: 'Track Progress',
      description: 'Monitor progress, identify blockers, and keep everything moving toward completion.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            From idea to completion in three simple steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-border -translate-y-1/2"></div>
          
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-surface rounded-xl p-8 text-center border border-border relative z-10 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;