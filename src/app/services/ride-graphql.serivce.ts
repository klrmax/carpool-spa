import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GET_ALL_RIDES, SEARCH_RIDES, GET_RIDE_BY_ID} from '../graphql/ride.queries';
import { Ride } from '../services/ride.service';


@Injectable({
  providedIn: 'root'
})
export class RideGraphqlService {
  
  constructor(private apollo: Apollo) {}

  // Alle Fahrten beim Laden der Seite
  getAllRides(): Observable<any[]> {
  console.log('GraphQL: Requesting getAllRides...');
    return this.apollo
      .watchQuery<{ getAllRides: Ride[] }>({
        query: GET_ALL_RIDES
      })
      .valueChanges.pipe(
        map((result) => {
          console.log('GraphQL getAllRides response:', result);
          console.log('Data:', result.data);
          console.log('getAllRides:', result.data.getAllRides);
          return result.data.getAllRides || [];
        }),
        catchError((error) => {
          console.error('GraphQL getAllRides error:', error);
          console.error('   Error message:', error.message);
          console.error('   GraphQL errors:', error.graphQLErrors);
          console.error('   Network error:', error.networkError);
          return of([]);
        })
      );
  }

  // Gefilterte Suche
  searchRides(
    start?: string,
    destination?: string,
    date?: string,
    time?: string
    ): Observable<Ride[]> {
  
    // Alle Parameter übergeben, auch wenn sie undefined sind
    // Das Backend kann dann damit umgehen
    const variables: any = {
      start: start || null,
      destination: destination || null,
      date: date || null,
      time: time || null
    };

  console.log('GraphQL: Requesting searchRides with variables:', variables);
    return this.apollo
      .watchQuery<{ searchRides: Ride[] }>({
        query: SEARCH_RIDES,
        variables
      })
      .valueChanges.pipe(
        map((result) => {
          console.log('GraphQL searchRides response:', result.data.searchRides);
          return result.data.searchRides || [];
        }),
        catchError((error: any) => {
          console.error('GraphQL searchRides error:', error);
          return of([]);
        })
      );
  }

  getRideById(id: number): Observable<Ride | undefined> {
  console.log('GraphQL: Requesting getRideById with id:', id);
    return this.apollo
      .watchQuery<{ getRideById: Ride }>({
        query: GET_RIDE_BY_ID,
        variables: { id }
      })
      .valueChanges.pipe(
        map((result) => {
          console.log('GraphQL getRideById response:', result.data.getRideById);
          return result.data.getRideById;
        }),
        catchError((error: any) => {
          console.error('GraphQL getRideById error:', error);
          return of(undefined);
        })
      );
  }


}