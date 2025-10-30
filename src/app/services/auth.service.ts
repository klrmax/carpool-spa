import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string | null = null;
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  public readonly isAuthenticated: Observable<boolean> = this._isAuthenticated.asObservable();

  constructor() {
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

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      this.authToken = null;
      this._isAuthenticated.next(false);
    }
  }
}