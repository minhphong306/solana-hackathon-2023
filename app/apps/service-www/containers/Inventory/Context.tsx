// https://stackoverflow.com/questions/57298149/react-ts-usecontext-usereducer-hook
import * as React from 'react';
import { InitialStateInventoryType } from './reducers';

const inventoryContext = React.createContext(
  {} as {
    state: InitialStateInventoryType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: React.Dispatch<any>;
  }
);

export default inventoryContext;
