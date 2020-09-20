import { ActionCreator } from "redux";
import { StoreAuthState, ClearAuthState } from "../types/auth";
import { AuthActionTypes } from "./actionTypes";

export const storeAuthState: ActionCreator<StoreAuthState> = (
  accessToken: string,
  refreshToken: string
) => {
  window.localStorage.setItem("accessToken", accessToken);
  window.localStorage.setItem("refreshToken", refreshToken);
  return {
    type: AuthActionTypes.StoreAuthState,
    payload: {
      accessToken,
      refreshToken,
    },
  };
};

export const clearAuthState: ActionCreator<ClearAuthState> = () => ({
  type: AuthActionTypes.ClearAuthState,
});
