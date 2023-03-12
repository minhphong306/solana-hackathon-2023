export type InventoryAction =
  | {
      type: 'UPDATE_STATE_DIALOG_SETUP_ACCOUNT';
      payload: boolean;
    }
  | { type: string; payload: boolean };

export const updateStateDialogSetupAccount = (payload: boolean) => ({
  type: 'UPDATE_STATE_DIALOG_SETUP_ACCOUNT',
  payload,
});
