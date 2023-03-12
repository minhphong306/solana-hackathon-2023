import { Cookies } from 'react-cookie';
const cookie = new Cookies();
export const MAX_AGE = 60 * 60 * 0.5; // 30minute
export function setTokenCookie(tokenName, value) {
  cookie.set(tokenName, value, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

export function removeCookie(NameCookie) {
  cookie.remove(NameCookie, { path: '/' });
}

export function getCookie(NameCookie) {
  return cookie.get(NameCookie);
}
