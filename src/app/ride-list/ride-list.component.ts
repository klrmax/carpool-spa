import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { RideGraphqlService } from '../services/ride-graphql.serivce';
import { RideService, Ride } from '../services/ride.service';
import { Observable } from 'rxjs';


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

  constructor(private rideService: RideService) {
    this.rides$ = this.rideService.rides$;
    this.loading$ = this.rideService.loading$;
    this.error$ = this.rideService.error$;
  }

  ngOnInit(): void {
    this.rideService.loadAllRides();
  }
  
  trackByRideId(index: number, ride: Ride): number {
    return ride.id;
  }

  // Helper to safely read driver name (avoids strict template type-check issues)
  getDriverName(ride: any): string {
    if (!ride) return 'N/A';
    const drv = ride.driver as any;
    return (drv && (drv.name || drv.username || drv.userName)) || 'N/A';
  }
}
