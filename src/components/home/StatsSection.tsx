import { COMPANY_INFO } from '@/lib/constants';

const stats = [
  { value: COMPANY_INFO.experience, label: 'Years Experience', suffix: '+' },
  { value: COMPANY_INFO.trips, label: 'Happy Trips', suffix: '+' },
  { value: COMPANY_INFO.staff, label: 'Dedicated Staff', suffix: '+' },
  { value: COMPANY_INFO.clients, label: 'Loyal Clients', suffix: '+' },
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
            <div 
              key={index} 
              className="space-y-2 group animate-fade-in-up opacity-0-start"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-primary/80">
                {stat.value}
                <span className="text-primary/70">{stat.suffix}</span>
              </div>
              <div className="text-hero-foreground/80 text-sm md:text-base transition-colors duration-300 group-hover:text-hero-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
