import { HomeActionTypes } from "../actions/actionTypes";
import { AlbumSimplified } from "./album";
import { PlaylistSimplified } from "./playlist";

export interface HomeState {
  featuredPlaylistsPrew: PlaylistSimplified[];
  newReleases: AlbumSimplified[];
  loading: boolean;
}

//actions
export interface ISetHomeLoading {
  type: HomeActionTypes.SET_LOADING;
  payload: boolean;
}

export interface ISetHomeData {
  type: HomeActionTypes.SET_DATA;
  payload: {
    featuredPlaylists: PlaylistSimplified[];
    newReleases: AlbumSimplified[];
  };
}

export type HomeActions = ISetHomeLoading | ISetHomeData;
