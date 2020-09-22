import { ErrorActionTypes } from "../actions/actionTypes";
export interface ErrorState {
  errorMsg: string;
  subMsg: string;
}

export interface ISetError {
  type: ErrorActionTypes.SET_ERROR;
  payload: {
    msg: string;
    subMsg: string;
  };
}

export type ErrorActions = ISetError;
