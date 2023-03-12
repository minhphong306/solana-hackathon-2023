// https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/initApollo.js
import fetch from 'isomorphic-fetch';
import { ApolloClient, ApolloCache, from } from '@apollo/client';
import Cookies from 'universal-cookie';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { AUTH_HEADER, JWT_ACCESS_TOKEN_KEY } from '@mp-workspace/data-access-constants';
// import refreshingTokenBased from './refreshing-token-based'
// import injectState, {applyState} from './injectState'
// import introspectionQueryResultData from './fragmentTypes.json'
// import {query as queryUser, initialState as initialStateUser} from '../auth/auth-wrapper'

// injectState(queryUser, initialStateUser)

// const fragmentMatcher = new IntrospectionFragmentMatcher({
//     introspectionQueryResultData,
// })

// const debug = require('debug')('libraries:initApollo')

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global['fetch'] = fetch;
}

function create(initialState, uri, cache, cookie) {
  const networkInterface = new BatchHttpLink({
    uri, // Server URL (must be absolute)
    credentials: 'same-origin',
    fetch,
    // fetch: refreshingTokenBased,
  });

  // middleware
  const authLink = setContext((_, { headers = {} }) => {
    // get the authentication token from local storage if it exists
    const token = cookie.get(JWT_ACCESS_TOKEN_KEY);

    // return the headers to the context so httpLink can read them
    if (token) {
      headers[AUTH_HEADER] = `Bearer ${token}`;
    }
    return {
      headers: {
        ...headers
      }
    };
  });

  // https://www.apollographql.com/docs/link/links/error/
  // const errorLink = onError(({ networkError }) => {
  //   // NOTE: logout if token expired
  //   console.log(networkError, 'networkError');
  //   if (networkError && networkError.statusCode === 401) {
  //     cookie.remove(JWT_ACCESS_TOKEN_KEY); // eslint-disable-line no-undef
  //     // cookie.remove(USER_ID_KEY); // eslint-disable-line no-undef
  //   }
  // });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  // https://www.apollographql.com/docs/link/composition.html#additive
  const link = from([authLink, errorLink, networkInterface]);

  const client = new ApolloClient({
    cache: cache.restore(initialState || {}),
    link,
    queryDeduplication: true,
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    ssrForceFetchDelay: 100,
  });

  // applyState(client)
  return client;
}

type InitApolloProps<TCacheShape> = {
  cache: ApolloCache<TCacheShape>;
  cookie: Cookies,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: Record<string, any>;
  uri?: string;
};

let apolloClient = null;

export default function initApollo<TCacheShape>({
  cache,
  cookie,
  initialState = {},
  uri = process.env.GRAPHQL_GATEWAY
}: InitApolloProps<TCacheShape>) {

  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, uri, cache, cookie);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, uri, cache, cookie);
  }

  return apolloClient;
}
