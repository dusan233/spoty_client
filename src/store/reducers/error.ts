import { ErrorActionTypes } from "../actions/actionTypes";
import { ErrorState, ErrorActions } from "../types/error";

const initialState: ErrorState = {
  errorMsg: "",
  subMsg: "",
};

const reducer = (state = initialState, action: ErrorActions) => {
  switch (action.type) {
    case ErrorActionTypes.SET_ERROR:
      return {
        errorMsg: action.payload.msg,
        subMsg: action.payload.subMsg,
      };
    default:
      return state;
  }
};

export default reducer;
