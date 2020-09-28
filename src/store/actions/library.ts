import { LibraryActionTypes } from "./actionTypes";
import { ActionCreator } from "redux";
import { ISetLibraryLoading } from "../types/library";
import { Dispatch } from "redux";
import { RootState } from "../reducers/index";
import { api } from "../../axios";
import {
  LibraryAlbumResult,
  SetLibraryAlbums,
  SetLibraryTracks,
  LibraryTrackResult,
} from "../types/library";
import {
  checkCurrentUserSavedAlbums,
  setAlbumLikes,
  setTrackLikes,
  checkCurrentUserSavedTracks,
} from "./user";
import { SavedAlbum } from "../types/album";
import { batch } from "react-redux";
import { SavedTrack } from "../types";

export const setLibraryLoading: ActionCreator<ISetLibraryLoading> = (
  loading: boolean
) => ({
  type: LibraryActionTypes.SET_LIBRARY_LOADING,
  payload: loading,
});

export const setLibraryAlbums: ActionCreator<SetLibraryAlbums> = (
  items: SavedAlbum[],
  total: number,
  action: string = ""
) => ({
  type: LibraryActionTypes.SET_LIBRARY_ALBUMS,
  payload: {
    items,
    total,
    action,
  },
});

export const setLibraryTracks: ActionCreator<SetLibraryTracks> = (
  items: SavedTrack[],
  total: number,
  action: string = ""
) => ({
  type: LibraryActionTypes.SET_LIBRARY_TRACKS,
  payload: {
    items,
    total,
    action,
  },
});

export const fetchUserTracks = (
  offset: number,
  accessToken: string | undefined
) => {
  return api.get<LibraryTrackResult>("/me/tracks", {
    params: {
      limit: 50,
      offset: offset,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const fetchUserAlbums = (
  offset: number,
  accessToken: string | undefined
) => {
  return api.get<LibraryAlbumResult>("/me/albums", {
    params: {
      limit: 50,
      offset: offset,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const getUserTracks = (loading: boolean) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    dispatch(setLibraryLoading(loading));
    try {
      const res = await fetchUserTracks(0, accessToken);

      let trackIds = "";

      res.data.items.slice(0, 50).forEach((album) => {
        if (trackIds === " ") {
          trackIds += album.track.id;
        } else {
          trackIds += "," + album.track.id;
        }
      });

      const savedAlbumsRes = await checkCurrentUserSavedTracks(
        trackIds,
        accessToken
      );

      console.log(res.data);
      batch(() => {
        dispatch(setLibraryTracks(res.data.items, res.data.total));
        dispatch(setTrackLikes([...savedAlbumsRes.data]));
        dispatch(setLibraryLoading(false));
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getUsersAlbums = (loading: boolean) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    dispatch(setLibraryLoading(loading));
    try {
      const res = await fetchUserAlbums(0, accessToken);

      let albumIds = "";

      res.data.items.slice(0, 50).forEach((album) => {
        if (albumIds === " ") {
          albumIds += album.album.id;
        } else {
          albumIds += "," + album.album.id;
        }
      });

      const savedAlbumsRes = await checkCurrentUserSavedAlbums(
        albumIds,
        accessToken
      );

      console.log(res.data);
      batch(() => {
        dispatch(setLibraryAlbums(res.data.items, res.data.total));
        dispatch(setAlbumLikes([...savedAlbumsRes.data]));
        dispatch(setLibraryLoading(false));
      });
    } catch (err) {
      console.log(err);
    }
  };
};
