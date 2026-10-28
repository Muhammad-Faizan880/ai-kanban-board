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

        <p className="text-center text-text-secondary text-sm mb-8">
          Everything your team needs to stay organized.
        </p>

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
      </div>
    </section>
  );
};

export default TrustStats;