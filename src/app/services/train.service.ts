import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface TrainConnection {
  id: string;
  departure_time: string;
  arrival_time: string;
  departure_station: string;
  arrival_station: string;
  duration: string;
  price: number;
  transfers: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  private baseUrl = 'https://carpoolbff-c576f25b03e8.herokuapp.com/api';

  constructor(private http: HttpClient) { }

  getTrainConnections(start: string, destination: string, date: string, hour: string): Observable<TrainConnection[]> {
    


    return this.http.get<TrainConnection[]>(`${this.baseUrl}/trains/${start}/${destination}/${date}/${hour}`).pipe(
      catchError(error => {
        console.error('Error fetching train connections:', error);
        return of([]);
      })
    );
  }


}