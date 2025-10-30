import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of, BehaviorSubject, throwError, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';



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
  private _searchTermsSubject: BehaviorSubject<SearchTerms> = new BehaviorSubject<SearchTerms>({
    from: null,
    to: null,
    date: null,
    time: null,
    seats: null
  });

  get searchTermsSubject(): BehaviorSubject<SearchTerms> {
    return this._searchTermsSubject;
  }

  private GET_ALL_RIDES = gql`
    query GetAllRides($filters: RideFiltersInput) {
      rides(filters: $filters) {
        id
        departure_location
        destination_location
        departure_time
        seats_available
        driver {
          id
          name
        }
        passengers {
          id
          name
        }
      }
    }
  `;

  constructor(private http: HttpClient, private authService: AuthService, private apollo: Apollo) { }

  // Update der Suchbegriffe
  updateSearchTerms(terms: SearchTerms): void {
    this._searchTermsSubject.next(terms);
  }

  
  getRides(): Observable<Ride[]> {
    return this.searchTermsSubject.pipe(
      switchMap(terms => {
        return from(this.apollo.query<{rides: Ride[]}>({
          query: this.GET_ALL_RIDES,
          variables: {
            filters: {
              departureLocation: terms.from || null,
              destinationLocation: terms.to || null,
              departureTime: terms.date ? `${terms.date}T${terms.time || '00:00'}:00` : null,
              seatsAvailable: terms.seats || null
            }
          }
        })).pipe(
          map(result => {
            const rides = result.data?.rides || [];
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