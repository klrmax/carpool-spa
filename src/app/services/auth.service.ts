import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string | null = null;
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private baseUrl = 'https://carpoolbff-c576f25b03e8.herokuapp.com';

  public readonly isAuthenticated: Observable<boolean> = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('authToken');
      this._isAuthenticated.next(!!this.authToken);
    }
  }

  getToken(): string | null {
    return this.authToken;
  }

  login(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      this.authToken = token;
      this._isAuthenticated.next(true);
    }
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users/logout`, {});
  }

  clearLocalStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('userid');
      localStorage.removeItem('username');
      this.authToken = null;
      this._isAuthenticated.next(false);
    }
  }

  redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://carpool-mpa-b2ab41ee1e9d.herokuapp.com/Login.html';
    }
  }
  
  redirectToHome(): void {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://carpool-mpa-b2ab41ee1e9d.herokuapp.com/';
    }
  }
}
