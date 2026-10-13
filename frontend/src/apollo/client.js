import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const uri = import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:4000/graphql';

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('gaadigo_auth_token');
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));
  return forward(operation);
});

const httpLink = new HttpLink({ uri });

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
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
