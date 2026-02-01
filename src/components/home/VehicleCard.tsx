import { Link } from 'react-router-dom';
import { Users, IndianRupee, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VEHICLE_TYPES } from '@/lib/constants';
import type { Vehicle, VehicleType } from '@/types/database';

interface VehicleCardProps {
  vehicle: Vehicle;
  showBookButton?: boolean;
}

export function VehicleCard({ vehicle, showBookButton = false }: VehicleCardProps) {
  const primaryImage = vehicle.images?.find(img => img.is_primary)?.url || 
    vehicle.images?.[0]?.url || 
    '/placeholder.svg';

  return (
    <Card className="overflow-hidden group card-glow border-border/50 hover:border-primary/50 transition-all duration-300 md:duration-500 hover:shadow-xl md:hover:shadow-2xl hover:shadow-primary/20 md:hover:-translate-y-2 bg-card/80 backdrop-blur-sm active:scale-[0.98]">
      <div className="relative h-44 sm:h-48 md:h-56 overflow-hidden">
        <img
          src={primaryImage}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-all duration-500 md:duration-700 group-hover:scale-105 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:duration-500" />
        <Badge className="absolute top-2 left-2 md:top-3 md:left-3 bg-primary text-primary-foreground shadow-lg shadow-primary/50 transition-all duration-300 text-xs md:text-sm">
          {VEHICLE_TYPES[vehicle.type as VehicleType]}
        </Badge>
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse-soft" />
        </div>
      </div>
      <CardHeader className="p-3 md:pb-2 transition-colors duration-300 group-hover:bg-muted/30">
        <h3 className="font-heading font-bold text-base md:text-lg line-clamp-1 transition-colors duration-300 group-hover:text-primary">{vehicle.name}</h3>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 md:space-y-3 transition-colors duration-300 group-hover:bg-muted/30">
        <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
          <span className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
            <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
            {vehicle.capacity} Seats
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Base (8hrs/80km)</span>
            <span className="font-semibold flex items-center text-primary">
              <IndianRupee className="h-3 w-3" />
              {vehicle.base_price.toLocaleString('en-IN')}
            </span>
          </div>
          {vehicle.extra_hour_rate && (
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-muted-foreground">Extra Hour</span>
              <span className="flex items-center">
                <IndianRupee className="h-2.5 w-2.5 md:h-3 md:w-3" />
                {vehicle.extra_hour_rate}/hr
              </span>
            </div>
          )}
          {vehicle.extra_km_rate && (
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-muted-foreground">Extra Km</span>
              <span className="flex items-center">
                <IndianRupee className="h-2.5 w-2.5 md:h-3 md:w-3" />
                {vehicle.extra_km_rate}/km
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex gap-2 transition-colors duration-300 group-hover:bg-muted/30">
        <Link to={`/rentals/${vehicle.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs md:text-sm transition-all duration-300 hover:border-primary hover:bg-primary/10 active:scale-95">
            View Details
          </Button>
        </Link>
        <Link to={`/booking?type=vehicle&id=${vehicle.id}`} className="flex-1">
          <Button size="sm" className="w-full text-xs md:text-sm bg-primary text-primary-foreground transition-all duration-300 hover:shadow-lg active:scale-95">
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
