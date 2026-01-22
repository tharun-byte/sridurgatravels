import { COMPANY_INFO } from '@/lib/constants';

const stats = [
  { value: COMPANY_INFO.experience, label: 'Years Experience' },
  { value: COMPANY_INFO.trips, label: 'Happy Trips' },
  { value: COMPANY_INFO.staff, label: 'Dedicated Staff' },
  { value: COMPANY_INFO.clients, label: 'Loyal Clients' },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-hero text-hero-foreground">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl md:text-5xl font-heading font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-hero-foreground/80 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
