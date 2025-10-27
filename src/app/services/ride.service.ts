import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Ride {
  id: number;
  from: string;
  to: string;
  date: string;
}

// Suchbegriffe, die wir erwarten
export interface SearchTerms {
  from: string | null;
  to: string | null;
  date: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RideService {

  // Unser Schein-Datenbank-Array
  private allRides: Ride[] = [
    { id: 1, from: 'Mosbach', to: 'Heidelberg', date: '2025-10-28T10:00' },
    { id: 2, from: 'Stuttgart', to: 'München', date: '2025-10-29T12:30' },
    { id: 3, from: 'Mosbach', to: 'Sinsheim', date: '2025-10-30T17:00' },
    { id: 4, from: 'Heilbronn', to: 'Frankfurt', date: '2025-11-01T08:00' }
  ];

  // Ein BehaviorSubject ist wie ein "Daten-Kanal", der sich den letzten Wert merkt.
  // Hier speichern wir die aktuellen Suchbegriffe. Startwert ist leer.
  private searchTermsSubject = new BehaviorSubject<SearchTerms>({ from: '', to: '', date: '' });

  constructor() { }

  // Öffentliche Methode, die die Searchbar aufruft, um die Suchbegriffe zu aktualisieren.
  updateSearchTerms(terms: SearchTerms): void {
    this.searchTermsSubject.next(terms);
  }

 getRides(): Observable<Ride[]> {
    return combineLatest([
      of(this.allRides),
      this.searchTermsSubject.asObservable()
    ]).pipe(
      map(([rides, terms]) => {
        // Wenn keine Suchbegriffe da sind, gib alle Fahrten zurück.
        if (!terms.from && !terms.to && !terms.date) {
          return rides;
        }

        // Andernfalls, filtere das 'rides'-Array
        return rides.filter(ride => {
          const fromMatch = terms.from ? ride.from.toLowerCase().includes(terms.from.toLowerCase()) : true;
          const toMatch = terms.to ? ride.to.toLowerCase().includes(terms.to.toLowerCase()) : true;
          
          // NEUE DATUMSFILTER-LOGIK
          // Wir vergleichen nur den Datumsteil (YYYY-MM-DD), nicht die Uhrzeit.
          const dateMatch = terms.date ? ride.date.startsWith(terms.date) : true;
          
          return fromMatch && toMatch && dateMatch;
        });
      })
    );
  }

  getRideById(id: number): Observable<Ride | undefined> {
    const ride = this.allRides.find(r => r.id === id);
    return of(ride);
  }
}