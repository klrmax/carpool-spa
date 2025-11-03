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
    // Hole die aktuelle User-ID aus localStorage
    if (typeof window !== 'undefined' && localStorage) {
  this.currentUserId = localStorage.getItem('userId');
  console.log('Constructor: Retrieved userId from localStorage:', this.currentUserId);
    }
  }

  ngOnInit(): void {
  this.rideId = +this.route.snapshot.paramMap.get('id')!;
  console.log('Loading ride with ID:', this.rideId);
  console.log('Current User ID from localStorage:', this.currentUserId);
  
  this.ride$ = this.rideService.getRideById(this.rideId);
  
  this.ride$.subscribe({
    next: (ride: any) => {
      console.log('Received ride data:', ride);
      console.log('Driver object:', ride?.driver);
      
      // Überprüfe, ob es meine Fahrt ist
      if (ride && ride.driver && this.currentUserId) {
        // Backend stellt die Fahrer-ID als `userid` bereit; falls ausnahmsweise `id` vorhanden ist, fallback darauf
        const driverId = ((ride.driver as any).userid || (ride.driver as any).id)?.toString();
        console.log('Driver userid from ride (preferred):', (ride.driver as any).userid);
        console.log('Driver id from ride (fallback):', (ride.driver as any).id);
        console.log('Driver ID used for comparison:', driverId);
        console.log('Current User ID:', this.currentUserId);
        this.isOwnRide = driverId === this.currentUserId;
        console.log('Is Own Ride:', this.isOwnRide);
      } else {
        console.warn('Missing ride, driver, or currentUserId:', { 
          hasRide: !!ride, 
          hasDriver: !!ride?.driver, 
          currentUserId: this.currentUserId,
          driverUserid: (ride?.driver as any)?.userid,
          driverId: (ride?.driver as any)?.id
        });
      }
    },
    error: (error) => {
      console.error('Error loading ride:', error);
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

    // Helpers to safely render driver fields regardless of backend shape
    getDriverName(ride: any): string {
      const d = ride?.driver as any;
      if (!d) return 'N/A';
      if (typeof d === 'string') return d;
      return d.name || d.username || d.userName || 'N/A';
    }

    getDriverMobile(ride: any): string | null {
      const d = ride?.driver as any;
      return d?.mobileNumber || null;
    }

    getDriverEmail(ride: any): string | null {
      const d = ride?.driver as any;
      return d?.email || null;
    }
}