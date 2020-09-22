import { ErrorActionTypes } from "./actionTypes";
import { ISetError } from "../types/error";
import { ActionCreator } from "redux";

export const setError: ActionCreator<ISetError> = (
  msg: string,
  subMsg: string
) => ({
  type: ErrorActionTypes.SET_ERROR,
  payload: {
    msg,
    subMsg,
  },
});
