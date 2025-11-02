import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_ALL_RIDES, SEARCH_RIDES, GET_RIDE_BY_ID} from '../graphql/ride.queries';
import { Ride } from '../services/ride.service';


@Injectable({
  providedIn: 'root'
})
export class RideGraphqlService {
  
  constructor(private apollo: Apollo) {}

  // Alle Fahrten beim Laden der Seite
  getAllRides(): Observable<any[]> {
    return this.apollo
      .watchQuery<{ getAllRides: Ride[] }>({
        query: GET_ALL_RIDES
      })
      .valueChanges.pipe(
        map((result) => result.data.getAllRides)
      );
  }

  // Gefilterte Suche
  searchRides(
    start?: string,
    destination?: string,
    date?: string,
    time?: string,
    seats?: number
  ): Observable<Ride[]> {
    return this.apollo
      .watchQuery<{ searchRides: Ride[] }>({
        query: SEARCH_RIDES,
        variables: { start, destination, date, time, seats }
      })
      .valueChanges.pipe(
        map((result) => result.data.searchRides)
      );
  }
  getRideById(id: number): Observable<Ride | undefined> {
  return this.apollo
    .watchQuery<{ getRideById: Ride }>({
      query: GET_RIDE_BY_ID,
      variables: { id }
    })
    .valueChanges.pipe(
      map((result) => result.data.getRideById)
    );
}
}