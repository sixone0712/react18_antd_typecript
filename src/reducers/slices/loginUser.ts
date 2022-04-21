import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

export interface UserRolesBoolean {
  isRoleJob: boolean;
  isRoleConfigure: boolean;
  isRoleRules: boolean;
  isRoleAddress: boolean;
  isRoleAccount: boolean;
}

interface LoginUserState {
  id: number;
  username: string;
  roles: UserRolesBoolean;
  timeout: number;
}

export const initialRolesState = {
  isRoleJob: false,
  isRoleConfigure: false,
  isRoleRules: false,
  isRoleAddress: false,
  isRoleAccount: false,
};

const initialState: LoginUserState = {
  id: 0,
  username: '',
  roles: {
    ...initialRolesState,
  },
  timeout: 30,
};

const loginUser = createSlice({
  name: 'login',
  initialState,
  reducers: {
    initLoginUser: () => initialState,
    setLoginUser(state, action: PayloadAction<LoginUserState>) {
      const { id, username, roles, timeout } = action.payload;
      state.id = id;
      state.username = username;
      state.roles = roles;
      state.timeout = timeout ?? 30;
    },
  },
});

export const { initLoginUser, setLoginUser } = loginUser.actions;

export const LoginUserSelector = (state: RootState): LoginUserState => state.loginUser;
export const LoginUserRolesSelector = (state: RootState): LoginUserState['roles'] => state.loginUser.roles;

export default loginUser.reducer;
