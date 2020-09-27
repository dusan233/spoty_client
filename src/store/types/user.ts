import { UserActionTypes } from "../actions/actionTypes";

export interface UserState {
  trackLikes: boolean[];
  albumLikes: boolean[];
}

export interface ISetTrackLikes {
  type: UserActionTypes.SET_TRACKS_LIKES;
  payload: boolean[];
  action: string;
}

export interface ISetAlbumLikes {
  type: UserActionTypes.SET_ALBUM_LIKES;
  payload: boolean[];
  action: string;
}

export type UserActions = ISetTrackLikes | ISetAlbumLikes;
