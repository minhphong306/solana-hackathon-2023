import { set } from 'dot-prop';
import {
  updateStateloadingPage,
  updateStateUserName,
  updateStateIsConnectedLogin,
  updateStateInstallWallet,
  updateStateDialogVerifyAccount,
  updateStateDialogChangePassword,
  updateStateDialogSetupAccount,
  updateIsSyncingState,
} from './actions';
import reducer, { initialState } from './reducer';
import cloneDeep from 'lodash/cloneDeep';

const state = cloneDeep(initialState);

describe('containers/AppContext/reducer', () => {
  it('updateStateloadingPage', () => {
    expect(reducer(initialState, updateStateloadingPage(true))).toEqual(
      set(state, 'loadingPage', true)
    );
    expect(reducer(initialState, updateStateloadingPage(false))).toEqual(
      set(state, 'loadingPage', false)
    );
  });
  it('updateStateUserName', () => {
    const initState = cloneDeep(initialState);
    const expectedState = set(cloneDeep(initialState), 'login.userName', 'dungnt');
    expect(reducer(initState, updateStateUserName('dungnt'))).toEqual(
      set(expectedState, 'login.userName', 'dungnt')
    );
  });
  it('updateStateIsConnectedLogin', () => {
    expect(reducer(initialState, updateStateIsConnectedLogin(true))).toEqual(
      set(state, 'login.isConnected', true)
    );
    expect(reducer(initialState, updateStateIsConnectedLogin(false))).toEqual(
      set(state, 'login.isConnected', false)
    );
  });
  it('updateStateInstallWallet', () => {
    expect(reducer(initialState, updateStateInstallWallet(true))).toEqual(
      set(state, 'login.dialogInstallWallet', true)
    );
    expect(reducer(initialState, updateStateInstallWallet(false))).toEqual(
      set(state, 'login.dialogInstallWallet', false)
    );
  });
  it('updateStateDialogVerifyAccount', () => {
    expect(reducer(initialState, updateStateDialogVerifyAccount(true))).toEqual(
      set(state, 'inventory.dialogVerifyAccount', true)
    );
    expect(
      reducer(initialState, updateStateDialogVerifyAccount(false))
    ).toEqual(set(state, 'inventory.dialogVerifyAccount', false));
  });
  it('updateStateDialogChangePassword', () => {
    expect(reducer(initialState, updateStateDialogChangePassword(true))).toEqual(
      set(state, 'profile.dialogChangePassword', true)
    );
    expect(
      reducer(initialState, updateStateDialogChangePassword(false))
    ).toEqual(set(state, 'profile.dialogChangePassword', false));
  });
  it('updateStateDialogSetupAccount', () => {
    expect(reducer(initialState, updateStateDialogSetupAccount(true))).toEqual(
      set(state, 'inventory.dialogSetupAccount', true)
    );
    expect(
      reducer(initialState, updateStateDialogSetupAccount(false))
    ).toEqual(set(state, 'inventory.dialogSetupAccount', false));
  });
  it('updateIsSyncingState', () => {
    expect(reducer(initialState, updateIsSyncingState(true))).toEqual(
      set(state, 'isSyncing', true)
    );
    expect(
      reducer(initialState, updateIsSyncingState(false))
    ).toEqual(set(state, 'isSyncing', false));
  });
});
