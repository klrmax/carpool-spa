// Queries for fetching rides
export const GET_ALL_RIDES = `
  query GetAllRides($filters: RideFiltersInput) {
    rides(filters: $filters) {
      id
      departure_location
      destination_location
      departure_time
      seats_available
      driver {
        id
        name
      }
      passengers {
        id
        name
      }
    }
  }
`;

export const SEARCH_RIDES = `
  query SearchRides($start: String, $destination: String, $date: String, $time: String, $seats: Int) {
    searchRides(
      start: $start
      destination: $destination
      date: $date
      time: $time
      seats: $seats
    ) {
      id
      departure_location
      destination_location
      departure_time
      seats_available
      driver {
        id
        name
      }
      passengers {
        id
        name
      }
    }
  }
`;

export const GET_RIDE_BY_ID = `
  query GetRideById($id: ID!) {
    ride(id: $id) {
      id
      departure_location
      destination_location
      departure_time
      seats_available
      driver {
        id
        name
        phone_number
      }
      passengers {
        id
        name
      }
      requests {
        id
        status
        user {
          id
          name
        }
      }
    }
  }
`;

export const GET_MY_CREATED_RIDES = `
  query GetMyCreatedRides {
    myCreatedRides {
      id
      departure_location
      destination_location
      departure_time
      seats_available
      passengers {
        id
        name
      }
      requests {
        id
        status
        user {
          id
          name
        }
      }
    }
  }
`;

export const GET_MY_JOINED_RIDES = `
  query GetMyJoinedRides {
    myJoinedRides {
      id
      departure_location
      destination_location
      departure_time
      seats_available
      driver {
        id
        name
        phone_number
      }
    }
  }
`;