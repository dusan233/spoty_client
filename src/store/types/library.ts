import { SavedAlbum, AlbumFull } from "./album";
import { TrackFull, SavedTrack } from "./index";
import { LibraryActionTypes } from "../actions/actionTypes";

export interface LibraryState {
  albums: SavedAlbum[];
  albumsTotal: number;
  tracks: SavedTrack[];
  tracksTotal: number;
  loading: boolean;
}

export interface ISetLibraryLoading {
  type: LibraryActionTypes.SET_LIBRARY_LOADING;
  payload: boolean;
}

export interface LibraryAlbumResult {
  items: SavedAlbum[];
  total: number;
}

export interface SetLibraryAlbums {
  type: LibraryActionTypes.SET_LIBRARY_ALBUMS;
  payload: {
    items: SavedAlbum[];
    total: number;
    action: string;
  };
}

export interface SetLibraryTracks {
  type: LibraryActionTypes.SET_LIBRARY_TRACKS;
  payload: {
    items: SavedTrack[];
    total: number;
    action: string;
  };
}

export interface LibraryTrackResult {
  items: SavedTrack[];
  total: number;
}

export type LibraryActions =
  | ISetLibraryLoading
  | SetLibraryAlbums
  | SetLibraryTracks;
