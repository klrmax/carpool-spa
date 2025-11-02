import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { RideGraphqlService } from './ride-graphql.serivce';
import { Apollo } from 'apollo-angular';
import { GET_ALL_RIDES } from '../graphql/ride.queries';

type RideRequest = any; // Define a proper interface for RideRequest

export interface RideId {
  id: number;
  departure_location: string;
  destination_location: string;
  departure_time: string;
  seats_available: number;
  driver: {
    id?: number;
    username: string;
    email?: string;
  };
  created_at?: string;
}
export interface Ride {
  id: number;
  startLocation: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  driver: {
    id?: number;
    name: string;
    email?: string;
  };
  created_at?: string;
}

export interface SearchTerms {
  from?: string | null;
  to?: string | null;
  date?: string | null;
  time?: string | null;
  seats?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private baseUrl = 'https://carpoolbff-c576f25b03e8.herokuapp.com/api';

  private ridesSubject = new BehaviorSubject<any[]>([]);
  public rides$ = this.ridesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  public searchTermsSubject = new BehaviorSubject<SearchTerms>({});
  public searchTerms$ = this.searchTermsSubject.asObservable();

  constructor( private http: HttpClient, private rideGraphqlService: RideGraphqlService) {}
  

  loadAllRides(): void {
    this.loadingSubject.next(true);
  this.rideGraphqlService.getAllRides().subscribe({
  next: (rides) => {
    console.log('Loaded rides:', rides);
    this.ridesSubject.next(rides);
    this.loadingSubject.next(false);
  },
      error: (error) => {
        console.error('Error loading rides:', error);
        this.loadingSubject.next(false);
      }
    });
  }

  updateSearchTerms(terms: SearchTerms): void {
  this.searchTermsSubject.next(terms);
  
  // Wenn Suchkriterien vorhanden sind, suche. Sonst lade alle Fahrten.
  if (this.hasSearchTerms(terms)) {
    this.searchRides(terms);
  } else {
    this.loadAllRides();
  }
}
  private searchRides(terms: SearchTerms): void {
    this.loadingSubject.next(true);
    const searchParams: any = {};
    if (terms.from) searchParams.start = terms.from;
    if (terms.to) searchParams.destination = terms.to;
    if (terms.date) searchParams.date = terms.date;
    if (terms.time) searchParams.time = terms.time;

    this.rideGraphqlService.searchRides(
      searchParams.start,
      searchParams.destination,
      searchParams.date,
      searchParams.time
    ).subscribe({
      next: (rides) => {
        this.ridesSubject.next(rides);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error searching rides:', error);
        this.loadingSubject.next(false);
      }
    });
  }

  private hasSearchTerms(terms: SearchTerms): boolean {
    return !!(terms.from || terms.to || terms.date || terms.time || terms.seats);
  }

getRideById(id: number): Observable<RideId | undefined> {
  console.log(`Fetching ride by ID: ${id}`);
  return this.http.get<RideId>(`${this.baseUrl}/ride/${id}`);
}

  createRide(rideData: any): Observable<any> {
    console.log('Creating ride with data:', rideData);
    return this.http.post(`${this.baseUrl}/ride`, rideData);
  }

  sendRideRequest(rideId: number): Observable<any> {
    console.log(`Sending ride request for ride ID: ${rideId}`);
    return this.http.post(`${this.baseUrl}/ride-request?rideId=${rideId}`, {});
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
    return this.http.patch(`${this.baseUrl}/ride-request?requestId=${requestId}`, { status: 'accepted' });
  }

  rejectRequest(requestId: number): Observable<any> {
    console.log(`Rejecting request with ID: ${requestId}`);
    return this.http.patch(`${this.baseUrl}/ride-request?requestId=${requestId}`,, { status: 'rejected' });
  }
}

