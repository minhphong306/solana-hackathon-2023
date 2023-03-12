import * as React from 'react';
import inventoryContext from './Context';
import { InitialStateInventoryType } from './reducers';

export const useInventoryContext = (): {
  state: InitialStateInventoryType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>;
} => {
  const contextValue = React.useContext(inventoryContext);
  return contextValue;
};
