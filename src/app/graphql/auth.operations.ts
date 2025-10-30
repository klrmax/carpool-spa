export const LOGIN = `
  mutation Login($mobileNumber: String!, $password: String!) {
    login(mobileNumber: $mobileNumber, password: $password) {
      token
      user {
        id
        name
        phone_number
      }
    }
  }
`;

export const REGISTER = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      message
      user {
        id
        name
        phone_number
      }
    }
  }
`;

export const LOGOUT = `
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const GET_CURRENT_USER = `
  query GetCurrentUser {
    me {
      id
      name
      phone_number
      created_rides {
        id
        departure_location
        destination_location
        departure_time
      }
      joined_rides {
        id
        departure_location
        destination_location
        departure_time
      }
    }
  }
`;

// TypeScript interfaces
export interface RegisterInput {
  name: string;
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    phone_number: string;
  };
}

export interface User {
  id: string;
  name: string;
  phone_number: string;
  created_rides: any[];
  joined_rides: any[];
}