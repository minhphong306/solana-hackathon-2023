import * as React from 'react';
import AppContext from './Context';
import { InitialStateType } from './reducer';

export const useAppContext = (): {
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
} => {
  const contextValue = React.useContext(AppContext);
  return contextValue;
};
