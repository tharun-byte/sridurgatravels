import { Link } from 'react-router-dom';
import { Clock, Mountain, IndianRupee, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TREK_DIFFICULTIES } from '@/lib/constants';
import type { Trek, TrekDifficulty } from '@/types/database';

interface TrekCardProps {
  trek: Trek;
}

const difficultyColors: Record<TrekDifficulty, string> = {
  easy: 'bg-success text-success-foreground',
  moderate: 'bg-warning text-warning-foreground',
  challenging: 'bg-primary text-primary-foreground',
  difficult: 'bg-destructive text-destructive-foreground',
};

export function TrekCard({ trek }: TrekCardProps) {
  const primaryImage = trek.images?.find(img => img.is_primary)?.url || 
    trek.images?.[0]?.url || 
    '/images/hero/hero-trekking.jpg';

  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48 overflow-hidden">
        <img
          src={primaryImage}
          alt={trek.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className={`absolute top-3 left-3 ${difficultyColors[trek.difficulty]}`}>
          {TREK_DIFFICULTIES[trek.difficulty]}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-heading font-bold text-lg line-clamp-1">{trek.name}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {trek.destination}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {trek.duration}
          </span>
          {trek.altitude && (
            <span className="flex items-center gap-1">
              <Mountain className="h-4 w-4" />
              {trek.altitude}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{trek.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Starting from</span>
          <span className="text-xl font-bold text-primary flex items-center">
            <IndianRupee className="h-4 w-4" />
            {trek.price_per_person.toLocaleString('en-IN')}
            <span className="text-sm font-normal text-muted-foreground ml-1">/person</span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/trekking/${trek.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
        <Link to={`/contact?trek=${trek.id}`} className="flex-1">
          <Button className="w-full bg-success text-success-foreground hover:bg-success/90">
            Book Trek
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
