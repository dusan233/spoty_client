import { AuthState } from "../types/auth";
import { AuthActionTypes } from "../actions/actionTypes";
import { AuthActions } from "../types/auth";

const initialState: AuthState = {
  accessToken: window.localStorage.getItem("accessToken") || undefined,
  refreshToken: window.localStorage.getItem("refreshToken") || undefined,
};

const reducer = (state = initialState, action: AuthActions) => {
  switch (action.type) {
    case AuthActionTypes.StoreAuthState:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case AuthActionTypes.ClearAuthState:
      return {
        ...state,
        accessToken: undefined,
        refreshToken: undefined,
      };
    default:
      return state;
  }
};

export default reducer;
