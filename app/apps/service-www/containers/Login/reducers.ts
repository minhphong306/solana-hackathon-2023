import { LoginAction } from './actions';

export type LoginStateType = {
  isOpenFogotPasswordDialog: boolean;
  // loadingPage: boolean;
  // successMsg: string | null;
  // loading: boolean;
};

// initialState is exported for testing purpose
export const initialState: LoginStateType = {
  isOpenFogotPasswordDialog: false,
  // loadingPage: false,
};

// reducer is exported for testing purpose
const reducer = (state: LoginStateType, action: LoginAction) => {
  switch (action.type) {
  case 'UPDATE_STATE_DIALOG_FORGOT_PASSWORD': {
    return { ...state, isOpenFogotPasswordDialog: action.payload };
  }

  default:
    throw new Error(`Unknown action ${action}`);
  }
};

export default reducer;
