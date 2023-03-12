import { gql, useQuery } from '@apollo/client';

const GetUserNameQuery = gql`
  query getName {
    profileInfo {
      nickname
      walletAddress
      isWalletLinked
      email
      isEmailConfirmed
      isChangedNickName
    }
  }
`;

export function useUser() {
  const { error, data } = useQuery(GetUserNameQuery);
  const user = data;
  return error ? null : user;
}
