import { HttpLink } from '@apollo/client/link/http';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const uri = 'https://carpoolbff-c576f25b03e8.herokuapp.com/graphql';

export function createApollo() {
  return new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only'
      }
    }
  });
}