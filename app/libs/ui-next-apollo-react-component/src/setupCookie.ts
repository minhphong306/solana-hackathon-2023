import Cookies from 'universal-cookie';

const isServer = !process.browser;

let cookie = null;

export default function setupCookie(cookies): Cookies {
  // Make sure to create a new CookieServer for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (isServer) {
    return new Cookies(cookies);
  }
  if (cookie) {
    return cookie;
  }
  cookie = new Cookies(cookies);
  return cookie;
}
