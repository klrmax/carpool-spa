import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interface für die erwartete Login-Antwort (mit Token)
export interface AuthResponse {
  message: string;
  token: string;
  expiresAt: string;
  userId: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private authApiUrl = 'https://carpoolbff-c576f25b03e8.herokuapp.com/api/users';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // --- REGISTER METHODE ---
  register(userData: any): Observable<any> {
    // Schickt die Daten an z.B. POST /api/users/register
    return this.http.post(`${this.authApiUrl}/register`, userData).pipe(
      tap(() => {
        // Bei Erfolg: zum Login navigieren
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError<any>('register'))
    );
  }

  // --- LOGIN METHODE ---
  login(credentials: any): Observable<AuthResponse> {
    // Format mobileNumber to ensure it's in the correct format
    const mobileNumber = credentials.phoneNumber.startsWith('+') 
      ? credentials.phoneNumber 
      : '+49' + credentials.phoneNumber.replace(/^0/, '');

    const payload = {
      mobileNumber: mobileNumber,
      password: credentials.password
    };

    console.log('Attempting login with:', { ...payload, password: '****' });

    return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, payload).pipe(
      tap((response) => {
        console.log('Login successful, response:', response);
        if (response && response.token && response.userId) {
          // Save token without Bearer prefix - will be added by interceptor
          this.setSession(response.token.replace('Bearer ', ''), response.userId);
          if (response.name) localStorage.setItem('userName', response.name);
          if (response.expiresAt) localStorage.setItem('tokenExpiration', response.expiresAt);
          // Navigate to main page
          this.router.navigate(['/rides']);
        } else {
          console.error('Invalid response structure:', response);
          throw new Error('Ungültige Antwort vom Server');
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        
        if (error.error?.error === 'Invalid credentials') {
          throw new Error('Telefonnummer oder Passwort ist falsch');
        }
        
        if (error.status === 400) {
          throw new Error('Bitte überprüfe deine Eingaben');
        }
        
        if (error.status === 0) {
          throw new Error('Keine Verbindung zum Server möglich');
        }
        
        throw new Error('Ein unerwarteter Fehler ist aufgetreten');
      })
    );
  }

  // --- LOGOUT METHODE ---
  logout(): void {
    const token = this.getToken();
    
    if (token) {
      // Send logout request to backend
      this.http.post(`${this.authApiUrl}/logout`, {}).subscribe({
        error: (err) => console.error('Logout request failed:', err)
      });
    }

    this.clearSession();
    this.router.navigate(['/login']);
  }

  // Session management methods
  private setSession(token: string, userId: string | number): void {
    localStorage.setItem('fgatoken', token);
    localStorage.setItem('userid', String(userId));
  }

  private clearSession(): void {
    localStorage.removeItem('fgatoken');
    localStorage.removeItem('userid');
    localStorage.removeItem('userName');
    localStorage.removeItem('tokenExpiration');
  }

  // Public methods for token/user info
  public getUserId(): string | null {
    return localStorage.getItem('userid');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  public getToken(): string | null {
    return localStorage.getItem('fgatoken');
  }

  // Einfache Fehlerbehandlung
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // App weiterlaufen lassen, indem ein leeres Ergebnis zurückgegeben wird.
      return of(result as T);
    };
  }
}