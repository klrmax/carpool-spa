export const CREATE_RIDE_REQUEST = `
  mutation CreateRideRequest($rideId: ID!) {
    createRideRequest(rideId: $rideId) {
      id
      status
      ride {
        id
        departure_location
        destination_location
        departure_time
      }
      user {
        id
        name
      }
    }
  }
`;

export const GET_OPEN_REQUESTS = `
  query GetOpenRequests {
    openRequests {
      id
      status
      created_at
      ride {
        id
        departure_location
        destination_location
        departure_time
        seats_available
      }
      user {
        id
        name
        phone_number
      }
    }
  }
`;

export const GET_MY_REQUESTS = `
  query GetMyRequests {
    myRequests {
      id
      status
      created_at
      ride {
        id
        departure_location
        destination_location
        departure_time
        driver {
          id
          name
          phone_number
        }
      }
    }
  }
`;

export const UPDATE_REQUEST_STATUS = `
  mutation UpdateRequestStatus($id: ID!, $status: RequestStatus!) {
    updateRequestStatus(id: $id, status: $status) {
      id
      status
      ride {
        id
        seats_available
      }
      user {
        id
        name
      }
    }
  }
`;

// TypeScript types
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