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
import {
  checkCurrentUserSavedTracks,
  checkCurrentUserSavedAlbums,
  setTrackLikes,
  setAlbumLikes,
  setPlaylistLikes,
  checkUserSavedPlaylist,
} from "./user";
import { setError } from "./error";
import { ArtistFull } from "../types/artist";
import { PlaylistSimplified } from "../types/playlist";
import { AlbumSimplified } from "../types/album";
import { AxiosResponse } from "axios";

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
    const userId = getState().user.userId;
    try {
      const searchResponse = await getSearchData(type, term, accessToken, 0);

      if ("playlists" in searchResponse.data) {
        const promises: Promise<AxiosResponse<[boolean]>>[] = [];
        searchResponse.data.playlists.items.forEach((playlist) => {
          promises.push(
            checkUserSavedPlaylist(playlist.id, userId, accessToken)
          );
        });

        Promise.all(promises)
          .then((res) => {
            const playlistLikes: boolean[] = [];
            res.forEach((response) => playlistLikes.push(...response.data));
            batch(() => {
              dispatch(
                setSearchPlaylists(
                  searchResponse.data.playlists.items,
                  searchResponse.data.playlists.total,
                  "reset",
                  term
                )
              );
              dispatch(setPlaylistLikes([...playlistLikes]));
              dispatch(setSearchLoading(false));
            });
          })
          .catch((err) => console.log(err));
      } else if ("tracks" in searchResponse.data) {
        let trackIds = "";
        searchResponse.data.tracks.items.slice(0, 50).forEach((track) => {
          if (trackIds === " ") {
            trackIds += track.id;
          } else {
            trackIds += "," + track.id;
          }
        });

        const savedTracksRes = await checkCurrentUserSavedTracks(
          trackIds,
          accessToken
        );

        batch(() => {
          dispatch(
            setSearchTracks(
              searchResponse.data.tracks.items,
              searchResponse.data.tracks.total,
              "reset",
              term
            )
          );
          dispatch(setTrackLikes([...savedTracksRes.data]));
          dispatch(setSearchLoading(false));
        });
      } else if ("albums" in searchResponse.data) {
        let albumIds = "";

        searchResponse.data.albums.items.slice(0, 50).forEach((album) => {
          if (albumIds === " ") {
            albumIds += album.id;
          } else {
            albumIds += "," + album.id;
          }
        });

        const savedAlbumsRes = await checkCurrentUserSavedAlbums(
          albumIds,
          accessToken
        );

        batch(() => {
          dispatch(
            setSearchAlbums(
              searchResponse.data.albums.items,
              searchResponse.data.albums.total,
              "reset",
              term
            )
          );
          dispatch(setAlbumLikes([...savedAlbumsRes.data]));
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
      let errorMsg: string;
      let subMsg: string;

      errorMsg = "Opps! Something went wrong!";
      subMsg = "Please refresh the page and try again";

      batch(() => {
        dispatch(setSearchLoading(false));
        dispatch(setError(errorMsg, subMsg));
      });
    }
  };
};
