import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  // 1) Token aus URL übernehmen (kommt von der MPA nach erfolgreichem Login)
  const urlToken = route.queryParams['token'];
  if (urlToken && typeof urlToken === 'string' && urlToken.trim().length > 0) {
    console.log('[authGuard] Token aus URL empfangen – speichere und aktiviere Session');
    // Persistiere korrekt über den AuthService (damit Interceptor ihn liest)
    authService.login(urlToken);

    // Optionale User-Daten übernehmen (Parameter-Namen klein geschrieben wie in der MPA: userid, username)
    const userId = route.queryParams['userid'];
    const userName = route.queryParams['username'];
    if (userId) localStorage.setItem('userId', String(userId));
    if (userName) localStorage.setItem('userName', String(userName));

    // Zugriff erlauben
    return true;
  }

  // 2) Bereits eingeloggt? (Token ist schon in LocalStorage vorhanden)
  const token = authService.getToken();
  if (token) {
    return true;
  }

  // 3) Kein Token verfügbar → zur MPA-Login-Seite weiterleiten
  notificationService.showWarning('Bitte melden Sie sich an, um diese Seite zu sehen.');
  // Externe MPA-Login-URL
  window.location.href = 'https://carpool-mpa-b2ab41ee1e9d.herokuapp.com/public/Login.html';
  return false;
};