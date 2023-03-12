import { set } from 'dot-prop';
import cloneDeep from 'lodash/cloneDeep';
import {
  updateStateDialogForgotPassword,
} from './actions';
import reducer, { initialState } from './reducers';

const state = cloneDeep(initialState);

describe('containers/Login/reducers', () => {
  it('updateStateDialogForgotPassword should return true', () => {
    expect(
      reducer(initialState, updateStateDialogForgotPassword(true))
    ).toEqual(set(state, 'isOpenFogotPasswordDialog', true));
    expect(
      reducer(initialState, updateStateDialogForgotPassword(false))
    ).toEqual(set(state, 'isOpenFogotPasswordDialog', false));
  });
});
