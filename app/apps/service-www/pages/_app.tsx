import * as React from 'react';
import AppProps from 'next/app';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { FC, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Cookies } from 'react-cookie';
import Layout from '../components/Layout/Layout';
import { ACCESS_TOKEN } from '../constants';
import { CustomTheme } from '../components/Theme';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {RentProgramProvider} from "../containers/RentProgramProvider";

// Use require instead of import since order matters
require('../styles/globals.css');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const AppProviderNoSSR = dynamic(
  () => import('../containers/AppContext/Provider'),
  {
    ssr: false,
  }
);

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import('../containers/WalletConnectionProvider').then(
      ({ WalletConnectionProvider }) => WalletConnectionProvider
    ),
  {
    ssr: false,
  }
);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const cookie = new Cookies();
  const token = cookie.get(ACCESS_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

// const httpLink = createHttpLink({
//   uri: 'https://mp-graphql.alpha-v2.starbots.net/graphql',
// });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      getAnalytics(app);
    }
  }, []);

  return (
    <>
      <Script
        type="text/javascript"
        src="https://cloudfront.loggly.com/js/loggly.tracker-latest.min.js"
      ></Script>
      <Script
        id="init-loggly"
        dangerouslySetInnerHTML={{
          __html: `
            var _LTracker = _LTracker || [];
            _LTracker.push({
              'logglyKey': '563a8bf3-25c2-42d0-a464-7ea374ac17fe',
              'sendConsoleErrors': true,
              'tag': 'marketplace-logs'
            });
          `,
        }}
      />
      <ApolloProvider client={client}>
        <AppProviderNoSSR>
          <WalletConnectionProvider>
            <RentProgramProvider>
              <ThemeProvider theme={CustomTheme}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ThemeProvider>
            </RentProgramProvider>
          </WalletConnectionProvider>
        </AppProviderNoSSR>
      </ApolloProvider>
    </>
  );
};

export default App;
