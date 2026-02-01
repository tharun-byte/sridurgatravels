import { Link } from 'react-router-dom';
import { ArrowUpRight, Mountain, Palmtree, Building2, Tent } from 'lucide-react';

const categories = [
  {
    id: 'treks',
    title: 'Mountain Treks',
    description: 'Challenge yourself with peak climbs in the Western Ghats',
    image: '/images/treks/kumara-parvatha-trek.jpg',
    icon: Mountain,
    count: '8+ Treks',
    href: '/trekking',
    gradient: 'from-emerald-600/80 to-teal-800/90',
  },
  {
    id: 'beaches',
    title: 'Beach Treks',
    description: 'Coastal adventures with beach camping and sunsets',
    image: '/images/treks/gokarna-beach.jpg',
    icon: Palmtree,
    count: '3+ Packages',
    href: '/trekking',
    gradient: 'from-blue-600/80 to-cyan-800/90',
  },
  {
    id: 'tours',
    title: 'Weekend Tours',
    description: 'Curated getaways to hill stations and heritage sites',
    image: '/images/treks/coorg-tour.jpg',
    icon: Building2,
    count: '6+ Tours',
    href: '/trekking',
    gradient: 'from-purple-600/80 to-indigo-800/90',
  },
  {
    id: 'camping',
    title: 'Camping Trips',
    description: 'Stargazing, bonfires, and wilderness experiences',
    image: '/images/treks/kodachadri-trek.jpg',
    icon: Tent,
    count: '5+ Camps',
    href: '/trekking',
    gradient: 'from-orange-600/80 to-amber-800/90',
  },
];

export function TrekCategoriesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Explore By Category
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your <span className="text-primary">Adventure</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            From challenging mountain treks to relaxing beach getaways, find your perfect escape
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70 group-hover:opacity-80 transition-opacity duration-500`} />

              {/* Content */}
              <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-white">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <category.icon className="w-6 h-6" />
                </div>

                {/* Title & Description */}
                <h3 className="font-heading font-bold text-xl md:text-2xl mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {category.title}
                </h3>
                <p className="text-white/80 text-sm mb-3 line-clamp-2">
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    {category.count}
                  </span>
                  <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
