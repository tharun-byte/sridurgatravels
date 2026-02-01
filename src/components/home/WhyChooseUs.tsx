import { DollarSign, Shield, Users, Clock } from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Affordable Pricing',
    description: 'Competitive rates with transparent pricing and no hidden charges.',
    color: 'text-success',
    bgColor: 'bg-success/10',
    shadowColor: 'group-hover:shadow-success/30',
  },
  {
    icon: Shield,
    title: 'Well-Maintained Vehicles',
    description: 'Our fleet is regularly serviced and maintained for your safety.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    shadowColor: 'group-hover:shadow-primary/30',
  },
  {
    icon: Users,
    title: 'Experienced Drivers',
    description: 'Professional, trained drivers who know every route.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    shadowColor: 'group-hover:shadow-primary/30',
  },
  {
    icon: Clock,
    title: 'On-Time Service',
    description: 'Punctual pickup and drop-off, every single time.',
    color: 'text-success',
    bgColor: 'bg-success/10',
    shadowColor: 'group-hover:shadow-success/30',
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-gradient-to-b from-secondary to-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-50">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-success/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Why Choose <span className="text-gradient">Sri Durga Travels?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-1 opacity-0-start">
            With over 22 years of experience, we've built a reputation for reliability, 
            comfort, and exceptional customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-card/80 backdrop-blur-sm rounded-xl p-6 text-center border border-border/50 
                transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${feature.shadowColor}
                hover:border-primary/30 animate-fade-in-up opacity-0-start`}
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${feature.bgColor} flex items-center justify-center
                transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
                <feature.icon className={`h-8 w-8 ${feature.color} transition-transform duration-500 group-hover:scale-110`} />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-primary">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
