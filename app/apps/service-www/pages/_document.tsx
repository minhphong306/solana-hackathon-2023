import Document from 'next/document';
import NextScript from 'next/document';
import Html from 'next/document';
import Head from 'next/document';
import Main from 'next/document';
import { AppConfig } from '../utils/AppConfig';
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    solana: any;
    solflare: any;
    FB: any;
  }
}
// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
