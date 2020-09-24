import { UserActionTypes } from "../actions/actionTypes";

export interface UserState {
  trackLikes: boolean[];
}

export interface ISetTrackLikes {
  type: UserActionTypes.SET_TRACKS_LIKES;
  payload: boolean[];
}

export type UserActions = ISetTrackLikes;
