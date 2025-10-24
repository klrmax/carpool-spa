import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Wichtig für die Links
import { Observable } from 'rxjs';
import { Ride, RideService } from '../services/ride.service'; // Importiere Service und Interface

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // CommonModule für *ngFor, RouterLink für die Links
  templateUrl: './ride-list.component.html',
  styleUrl: './ride-list.component.scss'
})
export class RideListComponent implements OnInit {

  // Wir deklarieren eine Variable, die unsere Liste von Fahrten halten wird.
  // Der Typ ist ein "Observable" auf ein Array von Ride-Objekten.
  // Das '$' am Ende ist eine gängige Konvention, um Observables zu kennzeichnen.
  public rides$!: Observable<Ride[]>;

  // Wir injizieren den RideService über den Konstruktor.
  constructor(private rideService: RideService) {}

  // ngOnInit ist eine "Lebenszyklus-Methode".
  // Sie wird automatisch aufgerufen, wenn die Komponente initialisiert wird.
  ngOnInit(): void {
    // Wir rufen die getRides()-Methode vom Service auf und weisen
    // das zurückgegebene Observable unserer Variable zu.
    this.rides$ = this.rideService.getRides();
  }
}