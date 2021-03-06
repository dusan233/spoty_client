import { SavedAlbum } from "./album";
import { SavedTrack } from "./index";
import { LibraryActionTypes } from "../actions/actionTypes";
import { PlaylistSimplified } from "./playlist";
import { ArtistFull } from "./artist";

export interface LibraryState {
  albums: SavedAlbum[];
  albumsTotal: number;
  tracks: SavedTrack[];
  tracksTotal: number;
  playlists: PlaylistSimplified[];
  playlistsTotal: number;
  artists: ArtistFull[];
  artistsTotal: number;
  loading: boolean;
  loadingPlaylists: boolean;
}

export interface ISetLibraryLoading {
  type: LibraryActionTypes.SET_LIBRARY_LOADING;
  payload: boolean;
}

export interface SetLibraryPlaylistsLoading {
  type: LibraryActionTypes.SET_LIBRARY_PLAYLISTS_LOADING;
  payload: boolean;
}

export interface LibraryAlbumResult {
  items: SavedAlbum[];
  total: number;
}

export interface LibraryArtistsResult {
  artists: {
    items: ArtistFull[];
    total: number;
  };
}

export interface SetLibraryArtists {
  type: LibraryActionTypes.SET_LIBRARY_ARTISTS;
  payload: {
    item: ArtistFull[];
    total: number;
    action: string;
  };
}

export interface SetLibraryPlaylists {
  type: LibraryActionTypes.SET_LIBRARY_PLAYLISTS;
  payload: {
    items: PlaylistSimplified[];
    total: number;
    action: string;
  };
}

export interface RemoveLibraryPlaylist {
  type: LibraryActionTypes.REMOVE_LIBRARY_PLAYLIST;
  payload: {
    id: string;
  };
}

export interface AddLibraryPlaylist {
  type: LibraryActionTypes.ADD_LIBRARY_PLAYLIST;
  payload: PlaylistSimplified;
}
export interface EditLibraryPlaylist {
  type: LibraryActionTypes.EDIT_LIBRARY_PLAYLIST;
  payload: {
    id: string;
    name: string;
  };
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

export interface LibraryPlaylistsResult {
  items: PlaylistSimplified[];
  total: number;
}

export type LibraryActions =
  | ISetLibraryLoading
  | SetLibraryAlbums
  | SetLibraryTracks
  | SetLibraryPlaylists
  | SetLibraryPlaylistsLoading
  | RemoveLibraryPlaylist
  | AddLibraryPlaylist
  | SetLibraryArtists
  | EditLibraryPlaylist;
