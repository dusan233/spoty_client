import { UserActionTypes } from "../actions/actionTypes";

export interface UserState {
  name: string;
  image: string;
  product: string;
  trackLikes: boolean[];
  albumLikes: boolean[];
}

export interface ISetTrackLikes {
  type: UserActionTypes.SET_TRACKS_LIKES;
  payload: boolean[];
  action: string;
}
export interface SetUserData {
  type: UserActionTypes.SET_USER_DATA;
  payload: {
    name: string;
    image: string;
    product: string;
  };
}

export interface ISetAlbumLikes {
  type: UserActionTypes.SET_ALBUM_LIKES;
  payload: boolean[];
  action: string;
}

export type UserActions = ISetTrackLikes | ISetAlbumLikes | SetUserData;
