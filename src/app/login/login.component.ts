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
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[+]?[0-9]+$') // Numbers and optional + prefix
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  public errorMessage: string | null = null;
  public isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = null;
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // Get the form values
      const phoneNumber = this.loginForm.get('phoneNumber')?.value;
      const password = this.loginForm.get('password')?.value;
      
      console.log('Form submitted with phone:', phoneNumber);
      
      this.authService.login({ phoneNumber, password }).subscribe({
        next: () => {
          console.log('Login successful, navigation handled by service');
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Login component received error:', error);
          this.isLoading = false;
          // Use the error message from the service
          this.errorMessage = error.message;
        }
      });
    } else {
      if (this.loginForm.get('phoneNumber')?.hasError('pattern')) {
        this.errorMessage = 'Bitte gib eine gültige Telefonnummer ein (nur Zahlen und optional ein + am Anfang).';
      } else if (this.loginForm.get('phoneNumber')?.hasError('required')) {
        this.errorMessage = 'Bitte gib deine Telefonnummer ein.';
      } else if (this.loginForm.get('password')?.hasError('required')) {
        this.errorMessage = 'Bitte gib dein Passwort ein.';
      } else {
        this.errorMessage = 'Bitte fülle alle Felder korrekt aus.';
      }
    }
  }
}