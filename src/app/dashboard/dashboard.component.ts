import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MyRidesComponent } from '../my-rides/my-rides.component';
import { RideRequestsComponent } from '../ride-requests/ride-requests.component';
import { RideService } from '../services/ride.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MyRidesComponent, RideRequestsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab = 'myRides';
  
  createRideForm = new FormGroup({
    from: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    seats: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  constructor(
    private rideService: RideService, 
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit() {
    // Entferne sensible Token-Parameter aus der URL, nachdem der Guard sie verarbeitet hat
    const hasTokenInUrl = this.route.snapshot.queryParamMap.has('token');
    if (hasTokenInUrl) {
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearLocalStorage();
        this.notificationService.showSuccess('Du wurdest erfolgreich ausgeloggt!');
        setTimeout(() => {
          this.authService.redirectToHome();
        }, 500);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Auch wenn der Logout-Request fehlschlägt, clearen wir den lokalen Storage und redirecten
        this.authService.clearLocalStorage();
        this.notificationService.showSuccess('Du wurdest erfolgreich ausgeloggt!');
        setTimeout(() => {
          this.authService.redirectToHome();
        }, 500);
      }
    });
  }

  goToOtherPage() {
    this.router.navigate(['/rides']);
  }

  onSubmit(): void {
    if (this.createRideForm.valid) {
      const formValue = this.createRideForm.value;
      const rideData = {
        departure_location: formValue.from,
        destination_location: formValue.to,
        departure_time: `${formValue.date}T${formValue.time}:00`,
        seats_available: formValue.seats
      };

      this.rideService.createRide(rideData).subscribe({
        next: (newRide: any) => {
          this.notificationService.showSuccess('Fahrt wurde erfolgreich erstellt!');
          this.createRideForm.reset();
          this.setActiveTab('myRides');
        },
        error: (error: any) => {
          // Die 401-Fehlerbehandlung wird global vom AuthInterceptor übernommen.
          this.notificationService.showError(error.message || 'Fehler beim Erstellen der Fahrt. Bitte versuchen Sie es später erneut.');
        }
      });
    } else {
      let errorMessage = 'Bitte füllen Sie alle Pflichtfelder aus:';
      if (this.createRideForm.get('from')?.hasError('required')) {
        errorMessage += '\n- Startort';
      }
      if (this.createRideForm.get('to')?.hasError('required')) {
        errorMessage += '\n- Zielort';
      }
      if (this.createRideForm.get('date')?.hasError('required')) {
        errorMessage += '\n- Datum';
      }
      if (this.createRideForm.get('time')?.hasError('required')) {
        errorMessage += '\n- Uhrzeit';
      }
      if (this.createRideForm.get('seats')?.hasError('required')) {
        errorMessage += '\n- Anzahl der Plätze';
      } else if (this.createRideForm.get('seats')?.hasError('min')) {
        errorMessage += '\n- Mindestens ein Platz muss verfügbar sein';
      }
      this.notificationService.showWarning(errorMessage);
    }
  }
}