import { InventoryAction } from './actions';

export interface InitialStateInventoryType {
  dialogOpen: boolean;
}

// initialState is exported for testing purpose
export const initialState: InitialStateInventoryType = {
  dialogOpen: false,
};

// reducer is exported for testing purpose
const reducer = (state: InitialStateInventoryType, action: InventoryAction) => {
  switch (action.type) {
  case 'UPDATE_STATE_DIALOG_SETUP_ACCOUNT': {
    return { ...state, dialogOpenSetupAccount: action.payload };
  }

  default:
    throw new Error(`Unknown action ${action}`);
  }
};

export default reducer;
