import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import { deepPurple, pink } from '@mui/material/colors';
import { WalletDialogProvider as MaterialUIWalletDialogProvider } from '@solana/wallet-adapter-material-ui';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { SnackbarProvider } from 'notistack';
import { FC, ReactNode, useMemo } from 'react';
import getSolanaEnv from '../utils/getSolanaEnv';
import { AutoConnectProvider, useAutoConnect } from './AutoConnectProvider';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple[700],
    },
    secondary: {
      main: pink[700],
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          justifyContent: 'flex-start',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px 16px',
        },
        startIcon: {
          marginRight: 8,
        },
        endIcon: {
          marginLeft: 8,
        },
      },
    },
  },
});

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();

  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = getSolanaEnv();

  // You can also provide a custom RPC endpoint
  const endpoint = process.env.CLUSTER_API_URL;

  console.log(endpoint, 'endpoint');

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network]
  );

  // const { enqueueSnackbar } = useSnackbar();
  // const onError = useCallback(
  //   (error: WalletError) => {
  //     enqueueSnackbar(
  //       error.message ? `${error.name}: ${error.message}` : error.name,
  //       { variant: 'error' }
  //     );
  //     console.error(error);
  //   },
  //   [enqueueSnackbar]
  // );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        // onError={onError}
        autoConnect={autoConnect}
      >
        <MaterialUIWalletDialogProvider>
          {children}
        </MaterialUIWalletDialogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const WalletConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <AutoConnectProvider>
            <WalletContextProvider>{children}</WalletContextProvider>
          </AutoConnectProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
