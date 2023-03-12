import * as React from 'react';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { loadCandyProgramV2 } from '../utils/helpers/accounts';
import getSolanaEnv from '../utils/getSolanaEnv';

export interface SwapProgramContextState {
    swapProgram: anchor.Program
}

export const SwapProgramContext = React.createContext<SwapProgramContextState>({} as SwapProgramContextState);

export function useSwapProgram(): SwapProgramContextState {
  return React.useContext(SwapProgramContext);
}

export const SwapProgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWallet();
  const [swapProgram, setSwapProgram] = React.useState<anchor.Program>(null);
  
  React.useEffect(() => {
    loadCandyProgramV2(wallet as unknown as anchor.Wallet, getSolanaEnv(), null).then((program) => {
      setSwapProgram(program);
    });
  }, [wallet]);

  return (
    <SwapProgramContext.Provider value={{ swapProgram }}>{children}</SwapProgramContext.Provider>
  );
};