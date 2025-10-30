export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface RideRequest {
  id: string;
  status: RequestStatus;
  created_at: string;
  ride: {
    id: string;
    departure_location: string;
    destination_location: string;
    departure_time: string;
    seats_available: number;
    driver?: {
      id: string;
      name: string;
      phone_number: string;
    }
  };
  user: {
    id: string;
    name: string;
    phone_number: string;
  };
}