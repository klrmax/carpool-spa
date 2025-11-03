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

    return this.apollo
      .watchQuery<{ searchRides: Ride[] }>({
        query: SEARCH_RIDES,
        variables
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