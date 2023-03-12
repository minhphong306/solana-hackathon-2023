import * as React from 'react';
import AppContext from './Context';
import reducer, { initialState } from './reducers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('containers:Login:LoginProvider');

export type InventoryProviderProps = {
  children: React.ReactNode;
};

const InventoryProvider = ({ children }: InventoryProviderProps) => {
  debug('render');
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contextValue: any = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  InventoryProvider.displayName = 'containers_Login__LoginProvider';
}

InventoryProvider.defaultProps = {};

export default InventoryProvider;
