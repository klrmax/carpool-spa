import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Wir brauchen keine 'AbstractControl' oder 'ValidationErrors' mehr
import { 
  ReactiveFormsModule, 
  FormGroup, 
  FormControl, 
  Validators 
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Wir importieren das schon mal

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  public registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    // 'confirmPassword' und der 'passwordsMatchValidator' sind entfernt.
  });

  // Wir injizieren den AuthService
  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Wir rufen direkt den (zukünftigen) Service auf
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          // Erfolg! (Navigation passiert im Service)
          console.log('Registrierung erfolgreich');
        },
        error: (err) => {
          // Hier Fehler anzeigen, z.B. "Mobilnummer existiert schon"
          console.error('Registrierungs-Fehler:', err);
        }
      });
    } else {
      console.log('Formular ist ungültig.');
    }
  }
}