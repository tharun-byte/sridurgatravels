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
    <Card className="overflow-hidden group card-glow border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 bg-card/80 backdrop-blur-sm">
      <div className="relative h-48 overflow-hidden">
        <img
          src={primaryImage}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-lg shadow-primary/50 transition-all duration-300 group-hover:scale-110">
          {VEHICLE_TYPES[vehicle.type as VehicleType]}
        </Badge>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Sparkles className="h-6 w-6 text-primary animate-pulse-soft" />
        </div>
      </div>
      <CardHeader className="pb-2 transition-colors duration-300 group-hover:bg-muted/30">
        <h3 className="font-heading font-bold text-lg line-clamp-1 transition-colors duration-300 group-hover:text-primary">{vehicle.name}</h3>
      </CardHeader>
      <CardContent className="space-y-3 transition-colors duration-300 group-hover:bg-muted/30">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
            <Users className="h-4 w-4 text-primary" />
            {vehicle.capacity} Seats
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Base Package (8hrs/80km)</span>
            <span className="font-semibold flex items-center text-primary">
              <IndianRupee className="h-3 w-3" />
              {vehicle.base_price.toLocaleString('en-IN')}
            </span>
          </div>
          {vehicle.extra_hour_rate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Extra Hour</span>
              <span className="flex items-center">
                <IndianRupee className="h-3 w-3" />
                {vehicle.extra_hour_rate}/hr
              </span>
            </div>
          )}
          {vehicle.extra_km_rate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Extra Km</span>
              <span className="flex items-center">
                <IndianRupee className="h-3 w-3" />
                {vehicle.extra_km_rate}/km
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 transition-colors duration-300 group-hover:bg-muted/30">
        <Button variant="outline" className="flex-1 w-full transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20 active:scale-95" asChild>
          <Link to={`/rentals/${vehicle.id}`}>View Details</Link>
        </Button>
        <Button 
          className="flex-1 bg-primary text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:scale-105 active:scale-95"
          asChild
        >
          <Link to={`/booking?type=vehicle&id=${vehicle.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
