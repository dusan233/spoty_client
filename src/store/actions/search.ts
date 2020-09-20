import { Dispatch, ActionCreator } from "redux";
import { batch } from "react-redux";
import { AppThunk, TrackFull } from "../types/index";
import { api } from "../../axios";
import { RootState } from "../reducers/index";
import { SearchActionTypes } from "./actionTypes";
import {
  SearchResultPlaylists,
  ISetSearchLoading,
  ISetSearchPlaylists,
  ISetSearchAlbums,
  ISetSearchArtists,
  ISetSearchTracks,
  ISetSearchTerm,
} from "../types/search";
import { ArtistFull } from "../types/artist";
import { PlaylistSimplified } from "../types/playlist";
import { AlbumSimplified } from "../types/album";

export const getSearchData = (
  type: string,
  term: string,
  accessToken: string | undefined,
  startIndex: number
) => {
  return api.get<SearchResultPlaylists>("https://api.spotify.com/v1/search", {
    params: {
      q: term,
      type: type,
      limit: 50,
      offset: startIndex,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const setSearchLoading: ActionCreator<ISetSearchLoading> = (
  loading: boolean
) => ({
  type: SearchActionTypes.SET_SEARCH_LOADING,
  payload: loading,
});

export const setSearchTerm: ActionCreator<ISetSearchTerm> = (term: string) => ({
  type: SearchActionTypes.SET_SEARCH_TERM,
  payload: {
    term,
  },
});

export const setSearchPlaylists: ActionCreator<ISetSearchPlaylists> = (
  items: PlaylistSimplified[],
  total: number,
  type: string,
  term: string
) => ({
  type: SearchActionTypes.SET_SEARCH_PLAYLISTS,
  payload: {
    items,
    total,
    type,
    term,
  },
});

export const setSearchAlbums: ActionCreator<ISetSearchAlbums> = (
  items: AlbumSimplified[],
  total: number,
  type: string,
  term: string
) => ({
  type: SearchActionTypes.SET_SEARCH_ALBUMS,
  payload: {
    items,
    total,
    type,
    term,
  },
});

export const setSearchTracks: ActionCreator<ISetSearchTracks> = (
  items: TrackFull[],
  total: number,
  type: string,
  term: string
) => ({
  type: SearchActionTypes.SET_SEARCH_TRACKS,
  payload: {
    items,
    total,
    type,
    term,
  },
});

export const setSearchArtists: ActionCreator<ISetSearchArtists> = (
  items: ArtistFull[],
  total: number,
  type: string,
  term: string
) => ({
  type: SearchActionTypes.SET_SEARCH_ARTISTS,
  payload: {
    items,
    total,
    type,
    term,
  },
});

export const fetchSearchData: ActionCreator<AppThunk> = (
  type: string,
  term: string
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setSearchLoading(true));
    const accessToken = getState().auth.accessToken;
    try {
      const searchResponse = await getSearchData(type, term, accessToken, 0);
      console.log(searchResponse);

      if ("playlists" in searchResponse.data) {
        batch(() => {
          dispatch(
            setSearchPlaylists(
              searchResponse.data.playlists.items,
              searchResponse.data.playlists.total,
              "reset",
              term
            )
          );
          dispatch(setSearchLoading(false));
        });
      } else if ("tracks" in searchResponse.data) {
        batch(() => {
          dispatch(
            setSearchTracks(
              searchResponse.data.tracks.items,
              searchResponse.data.tracks.total,
              "reset",
              term
            )
          );
          dispatch(setSearchLoading(false));
        });
      } else if ("albums" in searchResponse.data) {
        batch(() => {
          dispatch(
            setSearchAlbums(
              searchResponse.data.albums.items,
              searchResponse.data.albums.total,
              "reset",
              term
            )
          );
          dispatch(setSearchLoading(false));
        });
      } else if ("artists" in searchResponse.data) {
        batch(() => {
          dispatch(
            setSearchArtists(
              searchResponse.data.artists.items,
              searchResponse.data.artists.total,
              "reset",
              term
            )
          );
          dispatch(setSearchLoading(false));
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};
