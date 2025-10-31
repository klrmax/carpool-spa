import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  console.log(`[AuthInterceptor] Request to: ${request.url}`);
  console.log(`[AuthInterceptor] Token from AuthService: ${token}`);

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[AuthInterceptor] Authorization header set.');
  } else {
    console.log('[AuthInterceptor] No token found, Authorization header not set.');
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('[AuthInterceptor] Received 401 Error. Logging out and redirecting.', error);
        // Token möglicherweise abgelaufen → Session beenden und zur MPA-Login-Seite umleiten
        authService.logout();
        // Externe MPA-Login-URL (die nach Login zurück auf diese SPA weiterleitet)
        window.location.href = 'https://carpool-mpa-b2ab41ee1e9d.herokuapp.com/';
      }
      return throwError(() => error);
    })
  );
};