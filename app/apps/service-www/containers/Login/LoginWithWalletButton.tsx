import * as React from 'react';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { WalletMultiButton as MaterialUIWalletMultiButton } from '@solana/wallet-adapter-material-ui';
import { isEmpty } from 'lodash';
import { get } from 'dot-prop';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSnackbar } from 'notistack';
import jwt_decode from 'jwt-decode';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { useRouter } from 'next/router';
import { sign } from 'tweetnacl';
import { setTokenCookie, removeCookie } from '../../lib/AuthCookies';
import { ACCESS_TOKEN } from '../../constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('containers:Login:LoginWithWalletButton');

const CREATE_RANDOM_MESSAGE_MUTATION = gql`
  mutation CreateRandomMessage {
    createRandomMessage
  }
`;

const LOGIN_WITH_WALLET_MUTATION = gql`
  mutation SignInWithWallet(
    $wallet: String!
    $message: String!
    $signature: String!
  ) {
    signInWithWallet(
      input: { wallet: $wallet, message: $message, signature: $signature }
    ) {
      isWalletLinked
      isDontAskLink
      accessToken
      email
      isConfirmed
    }
  }
`;

const LoginWithWalletButton = (): JSX.Element => {
  debug('render');

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { publicKey, signMessage, disconnect } = useWallet();
  const [createRandomMessage] = useMutation(CREATE_RANDOM_MESSAGE_MUTATION);
  const [login] = useMutation(LOGIN_WITH_WALLET_MUTATION);

  async function checkingLoginWallet() {
    try {
      const randomMessageResponse = await createRandomMessage({
        onError: (error: ApolloError) => {
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      });

      const token = get(
        randomMessageResponse,
        'data.createRandomMessage',
        null
      );

      if (!token) {
        return;
      }

      const decodedToken = jwt_decode<{
        message: string;
      }>(token);

      // const token = randomMessage.data.createRandomMessage;
      setTokenCookie(ACCESS_TOKEN, token);

      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error('Wallet not connected!');
      // `signMessage` will be undefined if the wallet doesn't support it
      if (!signMessage)
        throw new Error('Wallet does not support message signing!');

      // Encode anything as bytes
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // const message = new TextEncoder().encode(decodedToken.message);

      // // Sign the bytes using the wallet
      // const signature = await signMessage(message);

      // // Verify that the bytes were signed using the private key that matches the known public key
      // if (!sign.detached.verify(message, signature, publicKey.toBytes()))
      //   throw new Error('Invalid signature!');

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // await login({
      //   variables: {
      //     wallet: publicKey.toString(),
      //     message: decodedToken.message,
      //     signature: bs58.encode(signature),
      //   },
      //   onCompleted: (data) => {
      //     const isWalletLinked = get(
      //       data,
      //       'signInWithWallet.isWalletLinked',
      //       null
      //     );
      //     const isConfirmed = get(data, 'signInWithWallet.isConfirmed', null);
      //     const accessToken = get(data, 'signInWithWallet.accessToken', null);
      //     const isDontAskLink = get(
      //       data,
      //       'signInWithWallet.isDontAskLink',
      //       null
      //     );
      //     const email = get(data, 'signInWithWallet.email', null);

      //     if (isWalletLinked) {
      //       setTokenCookie('isConnected', true);
      //     }

      //     if (!isConfirmed && isWalletLinked) {
      //       router.push(
      //         {
      //           pathname: '/verify',
      //           query: {
      //             email,
      //             sendmail: false,
      //           },
      //         },
      //         '/verify'
      //       );
      //     } else {
      //       setTokenCookie(ACCESS_TOKEN, accessToken);
      //       if (!isWalletLinked && !isDontAskLink) {
      //         router.push('/optionwallet');
      //       } else {
      //         router.push('/profile/renting?page=1');
      //       }
      //     }

      //     enqueueSnackbar('Login success', { variant: 'success' });
      //   },
      // });

      router.push('/profile/renting?page=1');
      enqueueSnackbar('Login success', { variant: 'success' });

    } catch (error) {
      disconnect();
      enqueueSnackbar(error.message, { variant: 'error' });
      removeCookie(ACCESS_TOKEN);
    }
  }

  React.useEffect(() => {
    if (!isEmpty(publicKey)) {
      checkingLoginWallet();
    }
  }, [publicKey]);

  return (
    <MaterialUIWalletMultiButton
      fullWidth
      sx={{
        borderRadius: '0.5rem',
        textTransform: 'none',
        background:
          'linear-gradient(#4A399F,#4A399F) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
        border: '1px solid transparent',
        mt: '1.5rem',
        py: '0.6rem',
        fontSize: 16,
      }}
    >
      Login with wallet
    </MaterialUIWalletMultiButton>
  );
};

if (process.env.NODE_ENV !== 'production') {
  LoginWithWalletButton.displayName = 'containers_Login__LoginWithWalletButton';
}

export default LoginWithWalletButton;
