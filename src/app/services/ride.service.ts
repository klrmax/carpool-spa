import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


// Der "Bauplan" für ein Ride-Objekt.
// Passe ihn an, falls die Daten von deinem Backend anders aussehen!
export interface Ride {
  id: number;
  from: string;
  to: string;
  date: string;
  //time: string;
  //driver: string;
  //seatsAvailable: number;
  // Gibt es weitere Felder? z.B. price, seats, driver, ...
}

@Injectable({
  providedIn: 'root'
})
export class RideService {

  // !!! ERSETZE DIESE URL DURCH DEINE ECHTE HEROKU BACKEND URL !!!
  private apiUrl = 'https://deine-app.herokuapp.com/api/rides';

  // Wir "injizieren" den HttpClient, damit wir ihn in dieser Klasse verwenden können.
  constructor(private http: HttpClient) { }

// Wir fügen die Beispieldaten wieder hinzu, um unabhängig vom Backend zu arbeiten
  private rides: Ride[] = [
    { id: 1, from: 'Mosbach', to: 'Heidelberg', date: '2025-10-28T10:00' },
    { id: 2, from: 'Stuttgart', to: 'München', date: '2025-10-29T12:30' },
    { id: 3, from: 'Mosbach', to: 'Sinsheim', date: '2025-10-30T17:00' },
    { id: 4, from: 'Heilbronn', to: 'Frankfurt', date: '2025-11-01T08:00' }
  ];


  // Diese Methode bleibt, wie sie war (für später)
  getRides(): Observable<Ride[]> {
    // Vorerst geben wir unsere Beispieldaten als Observable zurück
    return of(this.rides);
  }

  // --- NEUE METHODE ---
  // Sucht eine einzelne Fahrt anhand der ID in unseren Beispieldaten
  getRideById(id: number): Observable<Ride | undefined> {
    const ride = this.rides.find(r => r.id === id);
    return of(ride); // 'of' wandelt unsere einzelne Fahrt in ein Observable um
  }

}