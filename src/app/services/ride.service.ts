import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';
import { GET_ALL_RIDES } from '../graphql/ride.queries';

type RideRequest = any; // Define a proper interface for RideRequest

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

  constructor(private apollo: Apollo, private http: HttpClient) { }

  // Update der Suchbegriffe
  updateSearchTerms(terms: SearchTerms): void {
    this._searchTermsSubject.next(terms);
  }

  
  getRides(): Observable<Ride[]> {
    return this.searchTermsSubject.pipe(
      switchMap(terms => {
        return this.apollo.watchQuery<{ rides: Ride[] }>({
          query: GET_ALL_RIDES,
          variables: {
            filters: {
              departureLocation: terms.from || null,
              destinationLocation: terms.to || null,
              departureTime: terms.date ? `${terms.date}T${terms.time || '00:00'}:00` : null,
              seatsAvailable: terms.seats || null
            }
          }
        }).valueChanges.pipe(
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
    console.log(`Fetching ride by ID: ${id}`);
    return this.http.get<Ride>(`${this.baseUrl}/ride/${id}`);
  }

  createRide(rideData: any): Observable<any> {
    console.log('Creating ride with data:', rideData);
    return this.http.post(`${this.baseUrl}/ride`, rideData);
  }

  sendRideRequest(rideId: number): Observable<any> {
    console.log(`Sending ride request for ride ID: ${rideId}`);
    return this.http.post(`${this.baseUrl}/ride-request`, { rideId });
  }

  getMyCreatedRides(): Observable<Ride[]> {
    console.log('Fetching my created rides');
    return this.http.get<Ride[]>(`${this.baseUrl}/ride/mine`);
  }

  getMyJoinedRides(): Observable<Ride[]> {
    console.log('Fetching my joined rides');
    return this.http.get<Ride[]>(`${this.baseUrl}/ride/joined`);
  }

  getOpenRequests(): Observable<RideRequest[]> {
    console.log('Fetching open requests');
    return this.http.get<RideRequest[]>(`${this.baseUrl}/ride-request/open`);
  }

  getMyRequests(): Observable<RideRequest[]> {
    console.log('Fetching my requests');
    return this.http.get<RideRequest[]>(`${this.baseUrl}/ride-request/mine`);
  }

  acceptRequest(requestId: number): Observable<any> {
    console.log(`Accepting request with ID: ${requestId}`);
    return this.http.patch(`${this.baseUrl}/ride-request/${requestId}`, { status: 'accepted' });
  }

  rejectRequest(requestId: number): Observable<any> {
    console.log(`Rejecting request with ID: ${requestId}`);
    return this.http.patch(`${this.baseUrl}/ride-request/${requestId}`, { status: 'rejected' });
  }
}

export interface SearchTerms {
  from: string | null;
  to: string | null;
  date: string | null;
  time: string | null;
  seats: number | null;
}