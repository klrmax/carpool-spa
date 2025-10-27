import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Wichtig: Diese Module importieren
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-ride',
  standalone: true,
  // ReactiveFormsModule und RouterLink hier importieren
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-ride.component.html',
  styleUrl: './create-ride.component.scss'
})
export class CreateRideComponent {

  // Wir bauen ein Formular, das unserem 'Ride'-Objekt entspricht
  public createRideForm = new FormGroup({
    // Validators.required macht dies zu einem Pflichtfeld
    from: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    // Wir können auch mehrere Validatoren als Array übergeben
    seats: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  // Wir injizieren den Router, um später weiterleiten zu können
  constructor(private router: Router) {}
    // HINWEIS: Später injizieren wir hier auch den RideService
    // constructor(private rideService: RideService, private router: Router) {}

  onSubmit(): void {
    if (this.createRideForm.valid) {
      // Das Formular ist gültig
      console.log('Formulardaten:', this.createRideForm.value);
      
      // HIER werden wir in Schritt 4 den Service aufrufen, um die Daten zu senden.
      // 
      // Kleiner Ausblick, was hier passieren wird:
      // this.rideService.createRide(this.createRideForm.value).subscribe(newRide => {
      //   console.log('Neue Fahrt erstellt:', newRide);
      //   // Zur Detailseite der neuen Fahrt weiterleiten
      //   this.router.navigate(['/rides', newRide.id]); 
      // });

    } else {
      // Das Formular ist ungültig.
      console.log('Formular ist ungültig. Bitte alle Felder ausfüllen.');
      // Hier könnte man dem Nutzer visuelles Feedback geben
    }
  }
}