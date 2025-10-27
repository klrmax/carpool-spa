import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Wichtig
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs'; // 'of' für Fehlerfall
import { map, switchMap, catchError } from 'rxjs/operators'; // Wichtig

// Stelle sicher, dass das zu deinem Backend passt
export interface Ride {
  id: number;
  from: string;
  to: string;
  date: string; 
  availableSeats: number;
}

export interface SearchTerms {
  from: string | null;
  to: string | null;
  date: string | null;
  time: string | null;
  seats: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class RideService {

  // !!! TRAGE HIER DEINE ECHTE HEROKU-URL EIN !!!
  private apiUrl = 'https://carpoolbff-c576f25b03e8.herokuapp.com/api/ride'; 

  private searchTermsSubject = new BehaviorSubject<SearchTerms>({ 
    from: '', to: '', date: '', time: '', seats: null 
  });

  // HttpClient muss hier injiziert werden
  constructor(private http: HttpClient) { }

  updateSearchTerms(terms: SearchTerms): void {
    this.searchTermsSubject.next(terms);
  }

  // --- GET RIDES (FÜR DIE LISTE) ---
  // Diese Version nutzt switchMap und http.get
  getRides(): Observable<Ride[]> {
    return this.searchTermsSubject.pipe(
      switchMap(terms => 
        this.http.get<Ride[]>(this.apiUrl).pipe( // <-- ECHTER HTTP-AUFRUF
          map(rides => this.filterRides(rides, terms)),
          catchError(error => {
            console.error('Fehler beim Abrufen der Fahrten:', error);
            return of([]); // Im Fehlerfall leere Liste
          })
        )
      )
    );
  }

  // Filterlogik
  private filterRides(rides: Ride[], terms: SearchTerms): Ride[] {
    if (!terms.from && !terms.to && !terms.date && !terms.time && !terms.seats) {
      return rides;
    }
    return rides.filter(ride => {
      const fromMatch = terms.from ? ride.from.toLowerCase().includes(terms.from.toLowerCase()) : true;
      const toMatch = terms.to ? ride.to.toLowerCase().includes(terms.to.toLowerCase()) : true;
      const seatsMatch = (terms.seats && terms.seats > 0) ? ride.availableSeats >= terms.seats : true;
      
      let dateTimeMatch = true;
      if (terms.date) {
        const searchTime = terms.time || '00:00';
        const searchDateTime = new Date(`${terms.date}T${searchTime}`);
        const rideDateTime = new Date(ride.date);
        dateTimeMatch = rideDateTime >= searchDateTime;
      }
      return fromMatch && toMatch && seatsMatch && dateTimeMatch;
    });
  }

  // --- GET RIDE BY ID (FÜR DIE DETAILSEITE) ---
  getRideById(id: number): Observable<Ride | undefined> {
    return this.http.get<Ride>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Fehler beim Abrufen der Fahrt ${id}:`, error);
        return of(undefined); 
      })
    );
  }

  // --- CREATE RIDE (FÜR DAS NEUE FORMULAR) ---
  createRide(rideData: any): Observable<any> {
    const newRide = {
      from: rideData.from,
      to: rideData.to,
      date: `${rideData.date}T${rideData.time}`, 
      availableSeats: rideData.seats
    };

    return this.http.post(this.apiUrl, newRide).pipe(
      catchError(error => {
        console.error('Fehler beim Erstellen der Fahrt:', error);
        throw error; 
      })
    );
  }
}