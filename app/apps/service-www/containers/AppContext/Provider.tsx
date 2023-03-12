import * as React from 'react';
import AppContext from './Context';
import reducer, { initialState } from './reducer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('containers:AppContext:AppProvider');

export type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
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
  AppProvider.displayName = 'containers_AppContext__AppProvider';
}

AppProvider.defaultProps = {};

export default AppProvider;
