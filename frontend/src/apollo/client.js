import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const uri = import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:4000/graphql';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri,
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getVehicles: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getKafkaAuditEvents: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
