import React from 'react';
import * as cookies from 'cookie';
import App from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { CookiesProvider } from 'react-cookie';
import { InMemoryCache } from '@apollo/client';
import initApollo from './init';
import setupCookie from './setupCookie';

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 */
const isServer = !process.browser;

type SetupApolloVariables = {
  ssr?: boolean;
  cache?: InMemoryCache;
}

const setupApollo = ({ ssr = true, cache }: SetupApolloVariables = {}) => PageComponent => {
  const WithApollo = ({ apolloClient, cookie, apolloState, ...pageProps }: any) => {
    const c = setupCookie(cookie);

    const client = apolloClient || initApollo({
      initialState: apolloState,
      cache,
      cookie: c
    });

    return (
      // <CookiesProvider cookies={c}>
        <ApolloProvider client={client}>
          <PageComponent {...pageProps} />
        </ApolloProvider>
      // </CookiesProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
            PageComponent.displayName || PageComponent.name || 'Component';

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WithApollo.getInitialProps = async (ctx: any) => {
      const { AppTree } = ctx;
      const inAppContext = Boolean(ctx.ctx);

      if (process.env.NODE_ENV === 'development') {
        if (inAppContext) {
          console.warn(
            'Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n' +
                    'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n'
          );
        }
      }

      let cookieFromHeader = null;
      if(isServer) {
        cookieFromHeader = cookies.parse(ctx.req.headers.cookie || '');
      }

      const c = setupCookie(cookieFromHeader);

      if (ctx.apolloClient) {
        throw new Error('Multiple instances of withApollo found.');
      }

      // Initialize ApolloClient
      const apolloClient = initApollo({
        cache,
        cookie: c
      });

      // Add apolloClient to NextPageContext & NextAppContext
      // This allows us to consume the apolloClient inside our
      // custom `getInitialProps({ apolloClient })`.
      ctx.apolloClient = apolloClient;
      if (inAppContext) {
        ctx.ctx.apolloClient = apolloClient;
      }

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      } else if (inAppContext) {
        pageProps = await App.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/client/react/ssr');

            // Since AppComponents and PageComponents have different context types
            // we need to modify their props a little.
            let props;
            if (inAppContext) {
              props = { ...pageProps, apolloClient };
            } else {
              props = { pageProps: { ...pageProps, apolloClient } };
            }

            // Takes React AppTree, determine which queries are needed to render,
            // then fetche them all.
            await getDataFromTree(<AppTree {...props} />);
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error);
          }
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
        cookie: c.getAll(),
      };
    };
  }

  return WithApollo;
};

export default setupApollo;
