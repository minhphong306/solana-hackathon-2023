import * as cookie from "cookie";
import jwt_decode from "jwt-decode";
import isEmpty from "lodash/isEmpty";
import {get} from "dot-prop";
import {ACCESS_TOKEN} from "../../constants";

export default async function requireUserNotLoggedIn(context) {
  const cookieData = get(context, 'req.headers.cookie', '');
  const parsedCookies = cookie.parse(cookieData);
  const token = parsedCookies[ACCESS_TOKEN];
  const decodeToken = get(!isEmpty(token) ? jwt_decode(token) : {}, 'nickname', '');
  if (!isEmpty(decodeToken)) {
    return {
      redirect: {
        destination: '/profile/renting?page=1',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
