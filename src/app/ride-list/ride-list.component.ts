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
  templateUrl: './ride-list.component.html',
  styleUrl: './ride-list.component.scss'
})

export class RideListComponent implements OnInit {
  rides$: Observable<Ride[]>;
  loading$: Observable<boolean>;

  constructor(private rideService: RideService) {
    this.rides$ = this.rideService.rides$;
    this.loading$ = this.rideService.loading$;
  }

  ngOnInit(): void {
    this.rideService.loadAllRides();
  }
  trackByRideId(index: number, ride: Ride): number {
  return ride.id;
}
}
