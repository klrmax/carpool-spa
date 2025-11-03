import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './shared/notification.component';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'carpool-spa';
  isAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService, 
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated;
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
        this.authService.clearLocalStorage();
        this.notificationService.showSuccess('Du wurdest erfolgreich ausgeloggt!');
        setTimeout(() => {
          this.authService.redirectToHome();
        }, 500);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

