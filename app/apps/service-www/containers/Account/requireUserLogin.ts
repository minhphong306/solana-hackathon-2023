import {get} from "dot-prop";
import * as cookie from "cookie";
import {ACCESS_TOKEN} from "../../constants";
import isEmpty from "lodash/isEmpty";
import jwt_decode from "jwt-decode";
import {removeCookie} from "../../lib/AuthCookies";

export default async function requireUserLogin(context) {
  return {
    props: {},
  };

  const cookieData = get(context, 'req.headers.cookie', '');
  const parsedCookies = cookie.parse(cookieData);
  const token = parsedCookies[ACCESS_TOKEN];
  const decodeToken = get(!isEmpty(token) ? jwt_decode(token) : {}, 'nickname', '');
  if (isEmpty(decodeToken)) {
    removeCookie(ACCESS_TOKEN);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
