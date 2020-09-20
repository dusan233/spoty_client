import { AuthActionTypes } from "../actions/actionTypes";

export interface AuthState {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

// auth actions

export interface StoreAuthState {
  type: AuthActionTypes.StoreAuthState;
  payload: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ClearAuthState {
  type: AuthActionTypes.ClearAuthState;
}

export type AuthActions = StoreAuthState | ClearAuthState;
