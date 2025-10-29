import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'; 
import { Observable, of, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';



export interface Ride {
  id: number;
  departure_location: string;
  destination_location: string;
  departure_time: string;
  seats_available: number;
  driver: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
}
export interface SearchTerms {
  from: string | null;
  to: string | null;
  date: string | null;
  time: string | null;
  seats: number | null;
}
interface RideRequest {
  id: number;
  ride_id: number;
  user_id: number;
  status: string;
  created_at: string;
  ride: Ride;
  user: {
    name: string;
    userid: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RideService {

  private baseUrl = 'https://carpoolbff-c576f25b03e8.herokuapp.com/api';
  private searchTermsSubject: BehaviorSubject<SearchTerms> = new BehaviorSubject<SearchTerms>({
    from: null,
    to: null,
    date: null,
    time: null,
    seats: null
  });

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Update der Suchbegriffe
  updateSearchTerms(terms: SearchTerms): void {
    this.searchTermsSubject.next(terms);
  }

  // --- GET RIDES (FÜR DIE LISTE) ---
  // Diese Version nutzt switchMap und http.get
  getRides(): Observable<Ride[]> {
    return this.searchTermsSubject.pipe(
      switchMap(terms => {
        let url = `${this.baseUrl}/ride`;
        if (terms.from || terms.to || terms.date || terms.time) {
          const params = new HttpParams()
            .set('start', terms.from || '')
            .set('destination', terms.to || '')
            .set('date', terms.date || '')
            .set('time', terms.time || '');
          url = `${this.baseUrl}/ride/search${params.toString()}`;
        }
        return this.http.get<Ride[]>(url).pipe(
          map(rides => {
            return rides.filter(ride => {
              if (terms.seats && terms.seats > 0) {
                return ride.seats_available >= terms.seats;
              }
              return true;
            });
          }),
          catchError(error => {
            console.error('Fehler beim Abrufen der Fahrten:', error);
            return of([]);
          })
        );
      })
    );
  }

  getRideById(id: number): Observable<Ride | undefined> {
    return this.http.get<Ride>(`${this.baseUrl}/ride/${id}`).pipe(
      catchError(error => {
        console.error(`Fehler beim Abrufen der Fahrt ${id}:`, error);
        return of(undefined);
      })
    );
  }

  createRide(rideData: any): Observable<any> {
    const payload = {
      departure_location: rideData.from,
      destination_location: rideData.to,
      departure_time: `${rideData.date}T${rideData.time}:00`,
      seats_available: rideData.seats
    };

    return this.http.post(`${this.baseUrl}/ride`, payload).pipe(
      catchError(error => {
        console.error('Fehler beim Erstellen der Fahrt:', error);
        throw error;
      })
    );
  }

  sendRideRequest(rideId: number): Observable<any> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User nicht eingeloggt.'));
    }

    const payload = {
      userId: userId,
      rideId: rideId
    };

    return this.http.post(`${this.baseUrl}/ride-request`, payload).pipe(
      catchError(error => {
        console.error('Fehler beim Senden der Fahrtanfrage:', error);
        throw error;
      })
    );
  }

  getMyCreatedRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${this.baseUrl}/ride/mine`).pipe(
      catchError(error => {
        console.error('Error fetching created rides:', error);
        return of([]);
      })
    );
  }

  getMyJoinedRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${this.baseUrl}/ride/joined`).pipe(
      catchError(error => {
        console.error('Error fetching joined rides:', error);
        return of([]);
      })
    );
  }

  getOpenRequests(): Observable<RideRequest[]> {
    return this.http.get<RideRequest[]>(`${this.baseUrl}/ride-request/open`).pipe(
      catchError(error => {
        console.error('Error fetching open requests:', error);
        return of([]);
      })
    );
  }

  getMyRequests(): Observable<RideRequest[]> {
    return this.http.get<RideRequest[]>(`${this.baseUrl}/ride-request/mine`).pipe(
      catchError(error => {
        console.error('Error fetching my requests:', error);
        return of([]);
      })
    );
  }

  acceptRequest(requestId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/ride-request/${requestId}`, {
      action: 'accept'
    }).pipe(
      catchError(error => {
        console.error('Error accepting request:', error);
        throw error;
      })
    );
  }

  rejectRequest(requestId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/ride-request/${requestId}`, {
      action: 'reject'
    }).pipe(
      catchError(error => {
        console.error('Error rejecting request:', error);
        throw error;
      })
    );
  }
}