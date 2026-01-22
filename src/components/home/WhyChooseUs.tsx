import { DollarSign, Shield, Users, Clock } from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Affordable Pricing',
    description: 'Competitive rates with transparent pricing and no hidden charges.',
  },
  {
    icon: Shield,
    title: 'Well-Maintained Vehicles',
    description: 'Our fleet is regularly serviced and maintained for your safety.',
  },
  {
    icon: Users,
    title: 'Experienced Drivers',
    description: 'Professional, trained drivers who know every route.',
  },
  {
    icon: Clock,
    title: 'On-Time Service',
    description: 'Punctual pickup and drop-off, every single time.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Sri Durga Travels?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            With over 22 years of experience, we've built a reputation for reliability, 
            comfort, and exceptional customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 text-center card-hover border"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
