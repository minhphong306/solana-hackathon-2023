import * as jose from 'jose';

const allowedSignatureAlg = [
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES256K',
  'ES384',
  'ES512',
  'EdDSA',
];

export function decode(rawJwtToken: string) {
  const {0: headerToken} = rawJwtToken.split('.');
  let decoded;
  let header;
  try {
    decoded = jose.decodeJwt(rawJwtToken);
    header = JSON.parse(jose.base64url.decode(headerToken).toString());
  } catch (err) {
    decoded = null;
  }
  if (!decoded || !allowedSignatureAlg.includes(header.alg)) {
    return null;
  }
  return decoded;
}

export function isTokenExpired(exp: number) {
  if (Date.now() >= exp * 1000) {
    return true;
  }
  return false;
}