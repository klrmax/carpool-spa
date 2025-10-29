import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RideService } from '../services/ride.service';

@Component({
  selector: 'app-ride-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-requests.component.html',
  styleUrls: ['./ride-requests.component.css']
})
export class RideRequestsComponent implements OnInit {
  openRequests: any[] = [];
  myRequests: any[] = [];
  loading = true;
  error = '';

  constructor(private rideService: RideService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    Promise.all([
      this.rideService.getOpenRequests().toPromise(),
      this.rideService.getMyRequests().toPromise()
    ]).then(([openRequests, myRequests]) => {
      this.openRequests = openRequests || [];
      this.myRequests = myRequests || [];
      this.loading = false;
    }).catch(error => {
      this.error = 'Fehler beim Laden der Anfragen';
      this.loading = false;
    });
  }

  handleRequest(requestId: number, action: 'accept' | 'reject'): void {
    const method = action === 'accept' ? 
      this.rideService.acceptRequest(requestId) :
      this.rideService.rejectRequest(requestId);

    method.subscribe({
      next: () => {
        this.loadRequests(); // Reload after action
      },
      error: (error) => {
        this.error = `Fehler beim ${action === 'accept' ? 'Akzeptieren' : 'Ablehnen'} der Anfrage`;
      }
    });
  }
}