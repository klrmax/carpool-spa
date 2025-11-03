import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RideService } from '../services/ride.service';
import { AuthService } from '../services/auth.service';
import { filter, take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

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

  constructor(private rideService: RideService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated.pipe(
      filter(isAuth => isAuth),
      take(1)
    ).subscribe(() => {
      this.loadRides();
    });
  }

  loadRides(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      created: this.rideService.getMyCreatedRides(),
      joined: this.rideService.getMyJoinedRides()
    }).subscribe({
      next: (rides) => {
        this.createdRides = rides.created;
        this.joinedRides = rides.joined;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Fehler beim Laden der Fahrten';
        this.loading = false;
      }
    });
  }

  // Helper: returns a readable driver label regardless of shape (string or object)
  getDriverLabel(ride: any): string {
    if (!ride) return 'N/A';
    const d: any = ride.driver;
    if (!d) return 'N/A';
    if (typeof d === 'string') return d;
    return d.name || d.username || d.userName || 'N/A';
  }
}