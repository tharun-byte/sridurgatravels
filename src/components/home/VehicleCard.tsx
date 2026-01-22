import { Link } from 'react-router-dom';
import { Users, IndianRupee, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VEHICLE_TYPES } from '@/lib/constants';
import type { Vehicle, VehicleType } from '@/types/database';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const primaryImage = vehicle.images?.find(img => img.is_primary)?.url || 
    vehicle.images?.[0]?.url || 
    '/placeholder.svg';

  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48 overflow-hidden">
        <img
          src={primaryImage}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {VEHICLE_TYPES[vehicle.type as VehicleType]}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-heading font-bold text-lg line-clamp-1">{vehicle.name}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {vehicle.capacity} Seats
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Base Package (8hrs/80km)</span>
            <span className="font-semibold flex items-center">
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
      <CardFooter className="flex gap-2">
        <Link to={`/rentals/${vehicle.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
        <Link to={`/contact?vehicle=${vehicle.id}`} className="flex-1">
          <Button className="w-full bg-primary text-primary-foreground">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
