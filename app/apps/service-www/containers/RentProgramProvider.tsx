import * as React from 'react';
import * as anchor from '@project-serum/anchor';
import {useWallet} from '@solana/wallet-adapter-react';
import {loadListingProgram} from '../utils/helpers/accounts';
import getSolanaEnv from '../utils/getSolanaEnv';

export interface RentProgramContextState {
  rentProgram: anchor.Program
}

export const RentProgramContext = React.createContext<RentProgramContextState>({} as RentProgramContextState);

export function useRentProgram(): RentProgramContextState {
  return React.useContext(RentProgramContext);
}

export const RentProgramProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const wallet = useWallet();
  const [rentProgram, setRentProgram] = React.useState<anchor.Program>(null);

  React.useEffect(() => {
    console.log(wallet, 'wallet');
    loadListingProgram(wallet as unknown as anchor.Wallet, getSolanaEnv(), null).then((program) => {
      setRentProgram(program);
    });
  }, [wallet]);

  return (
    <RentProgramContext.Provider value={{rentProgram}}>{children}</RentProgramContext.Provider>
  );
};