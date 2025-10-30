export const CREATE_RIDE = `
  mutation CreateRide($input: CreateRideInput!) {
    createRide(input: $input) {
      id
      departure_location
      destination_location
      departure_time
      seats_available
      driver {
        id
        name
      }
    }
  }
`;

export const DELETE_RIDE = `
  mutation DeleteRide($id: ID!) {
    deleteRide(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_RIDE = `
  mutation UpdateRide($id: ID!, $input: UpdateRideInput!) {
    updateRide(id: $id, input: $input) {
      id
      departure_location
      destination_location
      departure_time
      seats_available
    }
  }
`;

// Input types for TypeScript
export interface CreateRideInput {
  departure_location: string;
  destination_location: string;
  departure_time: string;
  seats_available: number;
}

export interface UpdateRideInput {
  departure_location?: string;
  destination_location?: string;
  departure_time?: string;
  seats_available?: number;
}