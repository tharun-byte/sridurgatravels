import { useCountUp } from '@/hooks/useCountUp';

interface StatItemProps {
  value: number;
  label: string;
  suffix: string;
  delay: number;
}

function StatItem({ value, label, suffix, delay }: StatItemProps) {
  const { count, ref } = useCountUp({ end: value, duration: 2500 });
  
  return (
    <div 
      ref={ref}
      className="space-y-2 group animate-fade-in-up opacity-0-start"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="text-4xl md:text-5xl font-heading font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-primary/80">
        {count.toLocaleString('en-IN')}
        <span className="text-primary/70">{suffix}</span>
      </div>
      <div className="text-hero-foreground/80 text-sm md:text-base transition-colors duration-300 group-hover:text-hero-foreground">
        {label}
      </div>
    </div>
  );
}

const stats = [
  { value: 22, label: 'Years Experience', suffix: '+' },
  { value: 2000, label: 'Happy Trips', suffix: '+' },
  { value: 100, label: 'Dedicated Staff', suffix: '+' },
  { value: 450, label: 'Loyal Clients', suffix: '+' },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-hero text-hero-foreground relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
