export type LoginAction =
| {
    type: 'UPDATE_STATE_DIALOG_FORGOT_PASSWORD';
    payload: boolean;
  }
// | { type: "setSuccessMessage"; payload: string | null }
// | { type: "setLoading"; payload: boolean };
| { type: string; payload: boolean };

export const updateStateDialogForgotPassword = (payload: boolean) => ({
  type: 'UPDATE_STATE_DIALOG_FORGOT_PASSWORD',
  payload,
});
