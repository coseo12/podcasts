import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  // split,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';
import { LS_TOKEN } from './constants';

const token = localStorage.getItem(LS_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

// const wsLink = new WebSocketLink({
//   uri:
//     process.env.NODE_ENV === 'production'
//       ? 'wss://s-nuber-challenges.herokuapp.com/graphql'
//       : 'ws://localhost:4000/graphql',
//   options: {
//     reconnect: true,
//     connectionParams: {
//       'x-jwt': authToken() || '',
//     },
//   },
// });

const httpLink = createHttpLink({
  uri: 'https://s-nuber-challenges.herokuapp.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() || '',
    },
  };
});

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   // wsLink,
//   authLink.concat(httpLink)
// );

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
