import { Link } from 'react-router-dom';
import { Clock, Mountain, IndianRupee, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TREK_DIFFICULTIES } from '@/lib/constants';
import type { Trek, TrekDifficulty } from '@/types/database';

interface TrekCardProps {
  trek: Trek;
  showBookButton?: boolean;
}

const difficultyColors: Record<TrekDifficulty, string> = {
  easy: 'bg-success text-success-foreground shadow-success/50',
  moderate: 'bg-warning text-warning-foreground shadow-warning/50',
  challenging: 'bg-primary text-primary-foreground shadow-primary/50',
  difficult: 'bg-destructive text-destructive-foreground shadow-destructive/50',
};

export function TrekCard({ trek, showBookButton = false }: TrekCardProps) {
  const primaryImage = trek.images?.find(img => img.is_primary)?.url || 
    trek.images?.[0]?.url || 
    '/images/hero/hero-trekking.jpg';

  return (
    <Card className="overflow-hidden group card-glow border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 bg-card/80 backdrop-blur-sm">
      <div className="relative h-56 overflow-hidden">
        <img
          src={primaryImage}
          alt={trek.name}
          className="w-full h-full object-contain bg-muted/20 transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Badge className={`absolute top-3 left-3 ${difficultyColors[trek.difficulty]} shadow-lg transition-all duration-300 group-hover:scale-110`}>
          {TREK_DIFFICULTIES[trek.difficulty]}
        </Badge>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Sparkles className="h-6 w-6 text-primary animate-pulse-soft" />
        </div>
      </div>
      <CardHeader className="pb-2 transition-colors duration-300 group-hover:bg-muted/30">
        <h3 className="font-heading font-bold text-lg line-clamp-1 transition-colors duration-300 group-hover:text-primary">{trek.name}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3 text-primary" />
          {trek.destination}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 transition-colors duration-300 group-hover:bg-muted/30">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            {trek.duration}
          </span>
          {trek.altitude && (
            <span className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
              <Mountain className="h-4 w-4 text-primary" />
              {trek.altitude}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{trek.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Starting from</span>
          <span className="text-xl font-bold text-primary flex items-center transition-all duration-300 group-hover:scale-105">
            <IndianRupee className="h-4 w-4" />
            {trek.price_per_person.toLocaleString('en-IN')}
            <span className="text-sm font-normal text-muted-foreground ml-1">/person</span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 transition-colors duration-300 group-hover:bg-muted/30">
        <Button variant="outline" className="flex-1 w-full transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20 active:scale-95" asChild>
          <Link to={`/trekking/${trek.id}`}>View Details</Link>
        </Button>
        <Button 
          className="flex-1 bg-success text-success-foreground hover:bg-success/90 transition-all duration-300 hover:shadow-lg hover:shadow-success/40 hover:scale-105 active:scale-95"
          asChild
        >
          <Link to={`/booking?type=trek&id=${trek.id}`}>Book Trek</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
