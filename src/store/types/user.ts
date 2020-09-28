import { UserActionTypes } from "../actions/actionTypes";

export interface UserState {
  name: string;
  image: string;
  product: string;
  userId: string;
  trackLikes: boolean[];
  albumLikes: boolean[];
  playlistLikes: boolean[];
}

export interface ISetTrackLikes {
  type: UserActionTypes.SET_TRACKS_LIKES;
  payload: boolean[];
  action: string;
}

export interface SetPlaylistLikes {
  type: UserActionTypes.SET_PLAYLIST_LIKES;
  payload: boolean[];
  action: string;
}

export interface SetUserData {
  type: UserActionTypes.SET_USER_DATA;
  payload: {
    name: string;
    image: string;
    product: string;
    userId: string;
  };
}

export interface ISetAlbumLikes {
  type: UserActionTypes.SET_ALBUM_LIKES;
  payload: boolean[];
  action: string;
}

export type UserActions =
  | ISetTrackLikes
  | ISetAlbumLikes
  | SetUserData
  | SetPlaylistLikes;
