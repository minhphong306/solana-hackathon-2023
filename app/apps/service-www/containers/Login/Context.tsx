// https://stackoverflow.com/questions/57298149/react-ts-usecontext-usereducer-hook
import * as React from 'react';
import { LoginStateType } from './reducers';

const LoginContext  = React.createContext(
  {} as {
    state: LoginStateType;
    dispatch: React.Dispatch<any>;
  }
);

export default LoginContext ;
