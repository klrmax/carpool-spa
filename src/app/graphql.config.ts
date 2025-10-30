import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client/core';

export function createApollo(httpLink: ApolloLink) {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only'
      }
    }
  });
}