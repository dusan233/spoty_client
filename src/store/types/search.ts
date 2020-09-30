import { TrackFull } from "./index";
import { PlaylistSimplified } from "./playlist";
import { AlbumSimplified } from "./album";
import { ArtistFull } from "./artist";
import { SearchActionTypes } from "../actions/actionTypes";

//state

export interface ISearchState {
  loading: boolean;
  searchArtists: ArtistFull[];
  artistsTerm: string;
  artistsTotal: number;
  searchTracks: TrackFull[];
  tracksTerm: string;
  tracksTotal: number;
  searchAlbums: AlbumSimplified[];
  albumsTerm: string;
  albumsTotal: number;
  searchPlaylists: PlaylistSimplified[];
  playlistsTerm: string;
  playlistsTotal: number;
  searchTerm: string;
}

//actions

export interface ISetSearchLoading {
  type: SearchActionTypes.SET_SEARCH_LOADING;
  payload: boolean;
}

export interface ISetSearchPlaylists {
  type: SearchActionTypes.SET_SEARCH_PLAYLISTS;
  payload: {
    items: PlaylistSimplified[];
    total: number;
    type: string;
    term: string;
  };
}

export interface ISetSearchAlbums {
  type: SearchActionTypes.SET_SEARCH_ALBUMS;
  payload: {
    items: AlbumSimplified[];
    total: number;
    type: string;
    term: string;
  };
}

export interface ISetSearchTerm {
  type: SearchActionTypes.SET_SEARCH_TERM;
  payload: {
    term: string;
  };
}

export interface ISetSearchArtists {
  type: SearchActionTypes.SET_SEARCH_ARTISTS;
  payload: {
    items: ArtistFull[];
    total: number;
    type: string;
    term: string;
  };
}

export interface ISetSearchTracks {
  type: SearchActionTypes.SET_SEARCH_TRACKS;
  payload: {
    items: TrackFull[];
    total: number;
    type: string;
    term: string;
  };
}

export interface ClearSearchState {
  type: SearchActionTypes.CLEAN_SEARCH_STATE;
}

export type SearchActions =
  | ISetSearchLoading
  | ISetSearchPlaylists
  | ISetSearchAlbums
  | ISetSearchArtists
  | ISetSearchTracks
  | ISetSearchTerm
  | ClearSearchState;
//some other types

export interface SearchResultPlaylists {
  [key: string]: {
    items: PlaylistSimplified[];
    total: number;
  };
}
