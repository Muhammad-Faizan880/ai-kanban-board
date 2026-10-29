import { useEffect, useRef, useState } from "react";

const TrustStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { label: "Tasks Managed", value: 10000, suffix: "+", display: "10K+" },
    { label: "Projects Created", value: 2000, suffix: "+", display: "2K+" },
    { label: "Uptime", value: 99.9, suffix: "%", display: "99.9%" },
    { label: "Built for", value: 0, suffix: "", display: "Modern Teams" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const AnimatedNumber = ({ value, suffix, display }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible || value === 0) return;

      const duration = 1800;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const progress = Math.min(
          (currentTime - startTime) / duration,
          1
        );

        // Smooth ease-out animation
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = value * easeOut;

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [isVisible, value]);

    if (value === 0) {
      return display;
    }

    if (suffix === "%") {
      return `${count.toFixed(1)}${suffix}`;
    }

    return `${Math.floor(count).toLocaleString()}${suffix}`;
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 bg-surface border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Core Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-text-primary">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  display={stat.display}
                />
              </div>
              <div className="text-sm text-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Google Lighthouse Verified Scorecard Banner */}
        <div className="mt-10 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-muted/40 rounded-2xl p-4 sm:p-6 border border-border">
          <div className="flex items-center gap-3.5">
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-text-primary">
                  Google Lighthouse Certified
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Verified
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Production architecture with 96+ performance score and instant hydration
              </p>
            </div>
          </div>

          {/* 4 Score Rings */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-xs font-black text-emerald-700 shadow-xs">
                96
              </div>
              <span className="mt-1.5 text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                Performance
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-xs font-black text-emerald-700 shadow-xs">
                90
              </div>
              <span className="mt-1.5 text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                Accessibility
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-xs font-black text-emerald-700 shadow-xs">
                100
              </div>
              <span className="mt-1.5 text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                Best Practices
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-xs font-black text-emerald-700 shadow-xs">
                100
              </div>
              <span className="mt-1.5 text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                SEO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
