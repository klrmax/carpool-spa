import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interface für die erwartete Login-Antwort (mit Token)
export interface AuthResponse {
  token: string;
  // Ggf. weitere User-Infos
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private authApiUrl = 'https://carpoolbff-c576f25b03e8.herokuapp.com/api/ride';

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
    // Schickt die Daten an z.B. POST /api/users/login
    return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, credentials).pipe(
      tap((response) => {
        // Bei Erfolg: Token speichern
        this.setSession(response.token);
        // Zur Hauptseite navigieren
        this.router.navigate(['/rides']);
      }),
      catchError(this.handleError<AuthResponse>('login'))
    );
  }

  // --- LOGOUT METHODE ---
  logout(): void {
    const token = localStorage.getItem('fgatoken');
    
    // Optional: Dem Backend sagen, dass der Token ungültig ist
    // (basierend auf deinem jQuery-Code)
    this.http.post(`${this.authApiUrl}/logout`, { token: token }).subscribe();

    // In jedem Fall: Lokale Session löschen und weiterleiten
    localStorage.removeItem('fgatoken');
    this.router.navigate(['/login']);
  }

  // Lokalen Token speichern
  private setSession(token: string): void {
    localStorage.setItem('fgatoken', token);
  }

  // Prüfen, ob ein Token vorhanden ist
  public isLoggedIn(): boolean {
    return !!localStorage.getItem('fgatoken');
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