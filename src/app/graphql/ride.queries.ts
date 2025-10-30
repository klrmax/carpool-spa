import { gql } from 'apollo-angular';

// Queries for fetching rides
export const GET_ALL_RIDES = gql`
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

export const SEARCH_RIDES = gql`
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