import * as React from 'react';
import LoginContext from './Context';
import { LoginStateType } from './reducers';

export const useLoginContext = (): {
  state: LoginStateType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>;
} => {
  const contextValue = React.useContext(LoginContext);
  return contextValue;
};
