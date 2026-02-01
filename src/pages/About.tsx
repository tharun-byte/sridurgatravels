import { Layout } from '@/components/layout/Layout';
import { PageBanner } from '@/components/layout/PageBanner';
import { COMPANY_INFO, WHY_CHOOSE_US } from '@/lib/constants';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { Users, Bus, Award, Clock, Wallet, Car, User } from 'lucide-react';
import aboutBanner from '@/assets/banners/about-banner.jpg';

const iconMap: Record<string, React.ElementType> = {
  wallet: Wallet,
  car: Car,
  user: User,
  clock: Clock,
};

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <PageBanner
        pageSlug="about"
        defaultImage={aboutBanner}
        defaultTitle="About Us"
        defaultSubtitle={`${COMPANY_INFO.experience} years of excellence in travel and transport services`}
        height="lg"
      />

      {/* Company Story */}
      <section className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Our <span className="text-primary">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Sri Durga Travels has been a trusted name in Bengaluru's travel industry for over {COMPANY_INFO.experience} years. 
                  What started as a small bus rental service has grown into a comprehensive travel solutions provider, 
                  offering everything from luxury bus rentals to exciting trekking packages.
                </p>
                <p>
                  Our journey began with a simple mission: to provide safe, comfortable, and affordable travel experiences 
                  to our customers. Today, we're proud to have served over {COMPANY_INFO.trips} trips, building lasting 
                  relationships with {COMPANY_INFO.clients} loyal clients along the way.
                </p>
                <p>
                  With a dedicated team of {COMPANY_INFO.staff} staff members, we ensure that every journey with 
                  Sri Durga Travels is memorable. Our commitment to excellence has earned us {COMPANY_INFO.awards} industry 
                  awards, reflecting our unwavering dedication to customer satisfaction.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={aboutBanner}
                alt="Sri Durga Travels Fleet"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <p className="text-4xl font-bold">{COMPANY_INFO.experience}</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Why Choose Us */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose <span className="text-primary">Sri Durga Travels</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to making your journey comfortable, safe, and memorable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, index) => {
              const Icon = iconMap[item.icon] || Bus;
              return (
                <div
                  key={index}
                  className="bg-background p-6 rounded-xl shadow-sm border text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Our Core <span className="text-primary">Values</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-foreground">Customer First</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our top priority. We go the extra mile to ensure every journey exceeds expectations.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-foreground">Safety & Quality</h3>
              <p className="text-muted-foreground">
                Well-maintained vehicles, professional drivers, and strict safety protocols for peace of mind.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-foreground">Integrity</h3>
              <p className="text-muted-foreground">
                Transparent pricing, honest service, and genuine care for every customer we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default About;
