import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service'; // <-- Importieren

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public loginForm = new FormGroup({
    phoneNumber: new FormControl('', Validators.required), 
    password: new FormControl('', Validators.required)
  });

  // AuthService injizieren
  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Echten Service aufrufen
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Erfolg! (Navigation passiert im Service)
          console.log('Login erfolgreich, Token:', response.token);
        },
        error: (err) => {
          // Hier Fehler anzeigen, z.B. "Falsches Passwort"
          console.error('Login-Fehler:', err);
        }
      });
    } else {
      console.log('Formular ist ungültig.');
    }
  }
}