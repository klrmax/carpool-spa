import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="currentNotification" 
         class="notification" 
         [class.success]="currentNotification.type === 'success'"
         [class.error]="currentNotification.type === 'error'"
         [class.info]="currentNotification.type === 'info'"
         [class.warning]="currentNotification.type === 'warning'">
      {{ currentNotification.message }}
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      max-width: 80vw;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .success {
      background-color: #4CAF50;
    }

    .error {
      background-color: #f44336;
    }

    .info {
      background-color: #2196F3;
    }

    .warning {
      background-color: #ff9800;
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  currentNotification: Notification | null = null;
  private subscription: Subscription | null = null;
  private timeout: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.getNotifications()
      .subscribe(notification => {
        this.showNotification(notification);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private showNotification(notification: Notification) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.currentNotification = notification;
    
    if (notification.duration) {
      this.timeout = setTimeout(() => {
        this.currentNotification = null;
      }, notification.duration);
    }
  }
}