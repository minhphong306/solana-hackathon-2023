import {
  updateStateDialogForgotPassword,
} from './actions';

describe('containers/Login/actions', () => {
  it('updateStateDialogForgotPassword should return true', () => {
    expect(updateStateDialogForgotPassword(true)).toEqual({
      type: 'UPDATE_STATE_DIALOG_FORGOT_PASSWORD',
      payload: true
    });

    expect(updateStateDialogForgotPassword(false)).toEqual({
      type: 'UPDATE_STATE_DIALOG_FORGOT_PASSWORD',
      payload: false
    });
  });
});
