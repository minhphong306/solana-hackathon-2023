// https://stackoverflow.com/questions/57298149/react-ts-usecontext-usereducer-hook
import * as React from 'react';
import { InitialStateType } from './reducer';

const AppContext = React.createContext(
  {} as {
    state: InitialStateType;
    dispatch: React.Dispatch<any>;
  }
);

export default AppContext;
