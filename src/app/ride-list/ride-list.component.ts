import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { RideGraphqlService } from '../services/ride-graphql.serivce';
import { RideService, Ride } from '../services/ride.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // CommonModule für *ngFor, RouterLink für die Links
  templateUrl: './ride-list.component.html'
})

export class RideListComponent implements OnInit {
  rides$: Observable<Ride[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private currentUserId: string | null = null;

  constructor(private rideService: RideService) {
    // Hole die aktuelle User-ID
    if (typeof window !== 'undefined') {
      this.currentUserId = localStorage.getItem('userid');
    }
    
    // Filtere Rides: Zeige nur Rides von anderen (nicht von mir)
    this.rides$ = this.rideService.rides$.pipe(
      map((rides) => {
        if (!this.currentUserId) return rides;
        // Filtere heraus: Rides bei denen driver.id === currentUserId
        return rides.filter(ride => {
          const driverId = ride.driver?.id?.toString();
          return driverId !== this.currentUserId;
        });
      })
    );
    
    this.loading$ = this.rideService.loading$;
    this.error$ = this.rideService.error$;
  }

  ngOnInit(): void {
    this.rideService.loadAllRides();
  }
  
  trackByRideId(index: number, ride: Ride): number {
    return ride.id;
  }
}
