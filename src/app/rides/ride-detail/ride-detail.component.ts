import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Ride, RideId, RideService } from '../../services/ride.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ride-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ride-detail.component.html',
  styleUrls: ['./ride-detail.component.css']
})
export class RideDetailComponent implements OnInit {
  public ride$!: Observable<RideId | undefined>;
  public isRequesting = false;
  public requestSuccess = false;
  public requestError: string | null = null;
  public isDeleting = false;
  public deleteSuccess = false;
  public deleteError: string | null = null;
  public isOwnRide = false; // Ist das meine eigene Fahrt?
  private rideId!: number;
  private currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private rideService: RideService,
    private authService: AuthService
  ) {
    // Hole die aktuelle User-ID
    if (typeof window !== 'undefined') {
      this.currentUserId = localStorage.getItem('userid');
    }
  }

  ngOnInit(): void {
  this.rideId = +this.route.snapshot.paramMap.get('id')!;
  console.log('Loading ride with ID:', this.rideId);
  console.log('Current User ID from localStorage:', this.currentUserId);
  
  this.ride$ = this.rideService.getRideById(this.rideId);
  
  this.ride$.subscribe({
    next: (ride) => {
      console.log('Received ride data:', ride);
      console.log('Driver object:', ride?.driver);
      
      // Überprüfe, ob es meine Fahrt ist
      if (ride && ride.driver && this.currentUserId) {
        // REST API gibt driver.id zurück
        const driverId = ride.driver.id?.toString();
        console.log('Driver ID from ride:', driverId);
        console.log('Current User ID:', this.currentUserId);
        console.log('Vergleich: driverId === currentUserId?', driverId === this.currentUserId);
        
        this.isOwnRide = driverId === this.currentUserId;
        console.log('✅ Is Own Ride:', this.isOwnRide);
      } else {
        console.warn('⚠️ Missing ride, driver, or currentUserId:', { ride, driver: ride?.driver, currentUserId: this.currentUserId });
      }
    },
    error: (error) => {
      console.error('❌ Error loading ride:', error);
      console.error('Error status:', error.status);
      console.error('Error message:', error.message);
    }
  });
}
  

  sendRequest(): void {
    if (this.isRequesting) return;
    
    this.isRequesting = true;
    this.requestSuccess = false;
    this.requestError = null;

    this.rideService.sendRideRequest(this.rideId).subscribe({
      next: () => {
        this.requestSuccess = true;
        this.isRequesting = false;
      },
      error: (error) => {
        this.requestError = error.message || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
        this.isRequesting = false;
      }
    });
  }

  deleteRide(): void {
    if (this.isDeleting) return;
    
    if (!confirm('Möchtest du diese Fahrt wirklich löschen? Dies kann nicht rückgängig gemacht werden.')) {
      return;
    }
    
    this.isDeleting = true;
    this.deleteSuccess = false;
    this.deleteError = null;

    this.rideService.deleteRide(this.rideId).subscribe({
      next: () => {
        this.deleteSuccess = true;
        this.isDeleting = false;
        // Nach 1.5 Sekunden zurück zur Übersicht
        setTimeout(() => {
          window.location.href = '/rides';
        }, 1500);
      },
      error: (error) => {
        this.deleteError = error.message || 'Die Fahrt konnte nicht gelöscht werden. Bitte versuche es später erneut.';
        this.isDeleting = false;
      }
    });
  }
}