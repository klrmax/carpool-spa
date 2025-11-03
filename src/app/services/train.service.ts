import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface TrainConnection {
  trainCategory: string;
  departureTime: string;
  path: string;
  trainType: string;
  trainNumber: string;
  id: string;
  platform: string;
}

export interface TrainConnectionResponse {
  date: string;
  toEva: string;
  fromEva: string;
  hour: string;
  totalConnections: number;
  from: string;
  to: string;
  connections: TrainConnection[];
}

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  private baseUrl = 'https://carpoolbff-c576f25b03e8.herokuapp.com/api';

  constructor(private http: HttpClient) { }

  getTrainConnections(start: string, destination: string, date: string, hour: string): Observable<TrainConnectionResponse | null> {
    return this.http.get<TrainConnectionResponse>(`${this.baseUrl}/trains`, {
      params: {
        start: start,
        destination: destination,
        date: date,
        hour: hour
      }
    }).pipe(
      catchError(error => {
        console.error('Error fetching train connections:', error);
        return of(null);
      })
    );
  }

  // HH:MM → HHMM


}