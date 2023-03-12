import ReactGA from 'react-ga';

const isProduction = process.env.NODE_ENV === 'production';

export const initGoogleAnalytics = (key: string = process.env.NEXT_PUBLIC_GA_TRACKING_ID) => {
  if(isProduction) {
    ReactGA.initialize(key);
  }
};

export const logPageViewToGA = () => {
  if(isProduction) {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
};
