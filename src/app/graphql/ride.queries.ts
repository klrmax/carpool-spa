import { gql } from 'apollo-angular';

// Queries for fetching rides
export const GET_ALL_RIDES = gql`
  query GetAllRides {
    getAllRides {
      id
      startLocation
      destination
      departureTime
      availableSeats
      driver {
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
      startLocation
      destination
      departureTime
      availableSeats
      driver {
        name
      }
    }
  }
`;
export const GET_RIDE_BY_ID = gql`
  query GetRideById($id: Int!) {
    getRideById(id: $id) {
      id
      startLocation
      destination
      departureTime
      availableSeats
      driver {
        id
        name
        email
      }
      created_at
    }
  }
`;