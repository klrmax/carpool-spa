import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RideService } from '../services/ride.service';

@Component({
  selector: 'app-my-rides',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-rides.component.html',
  styleUrls: ['./my-rides.component.css']
})
export class MyRidesComponent implements OnInit {
  createdRides: any[] = [];
  joinedRides: any[] = [];
  loading = true;
  error = '';

  constructor(private rideService: RideService) {}

  ngOnInit(): void {
    this.loadRides();
  }

  loadRides(): void {
    this.loading = true;
    
    // Load created rides
    this.rideService.getMyCreatedRides().subscribe({
      next: (rides) => {
        this.createdRides = rides;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Fehler beim Laden der Fahrten';
        this.loading = false;
      }
    });

    // Load joined rides
    this.rideService.getMyJoinedRides().subscribe({
      next: (rides) => {
        this.joinedRides = rides;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Fehler beim Laden der Fahrten';
        this.loading = false;
      }
    });
  }
}