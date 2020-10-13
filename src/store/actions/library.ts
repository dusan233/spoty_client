import { LibraryActionTypes } from "./actionTypes";
import { ActionCreator } from "redux";
import {
  AddLibraryPlaylist,
  EditLibraryPlaylist,
  ISetLibraryLoading,
  LibraryArtistsResult,
  LibraryPlaylistsResult,
  RemoveLibraryPlaylist,
  SetLibraryArtists,
  SetLibraryPlaylists,
  SetLibraryPlaylistsLoading,
} from "../types/library";
import { Dispatch } from "redux";
import { RootState } from "../reducers/index";
import { AppThunk } from "../types/index";
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
import { PlaylistSimplified } from "../types/playlist";
import { ArtistFull } from "../types/artist";
import { setError } from "./error";

export const setLibraryLoading: ActionCreator<ISetLibraryLoading> = (
  loading: boolean
) => ({
  type: LibraryActionTypes.SET_LIBRARY_LOADING,
  payload: loading,
});

export const setLibraryPlaylistsLoading: ActionCreator<SetLibraryPlaylistsLoading> = (
  loading: boolean
) => ({
  type: LibraryActionTypes.SET_LIBRARY_PLAYLISTS_LOADING,
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

export const setLibraryPlaylists: ActionCreator<SetLibraryPlaylists> = (
  items: PlaylistSimplified[],
  total: number,
  action: string = ""
) => ({
  type: LibraryActionTypes.SET_LIBRARY_PLAYLISTS,
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

export const setLibraryArtists: ActionCreator<SetLibraryArtists> = (
  item: ArtistFull[],
  total: number,
  action: string = ""
) => ({
  type: LibraryActionTypes.SET_LIBRARY_ARTISTS,
  payload: {
    item,
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

export const fetchCurrentUserPlaylists = (
  offset: number,
  accessToken: string | undefined
) => {
  return api.get<LibraryPlaylistsResult>("/me/playlists", {
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

export const fetchUserArtists = (
  lastArtistId: string,
  accessToken: string | undefined
) => {
  return api.get<LibraryArtistsResult>("/me/following", {
    params: {
      type: "artist",
      after: lastArtistId ? lastArtistId : undefined,
      limit: 50,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const removeLibraryPlaylist: ActionCreator<RemoveLibraryPlaylist> = (
  id: string
) => ({
  type: LibraryActionTypes.REMOVE_LIBRARY_PLAYLIST,
  payload: {
    id,
  },
});

export const addLibraryPlaylist: ActionCreator<AddLibraryPlaylist> = (
  playlist: PlaylistSimplified
) => ({
  type: LibraryActionTypes.ADD_LIBRARY_PLAYLIST,
  payload: playlist,
});

export const editLibraryPlaylist: ActionCreator<EditLibraryPlaylist> = (
  name: string,
  id: string
) => ({
  type: LibraryActionTypes.EDIT_LIBRARY_PLAYLIST,
  payload: {
    id,
    name,
  },
});

export const getCurrentUserPlaylists: ActionCreator<AppThunk> = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    dispatch(setLibraryPlaylistsLoading(true));
    try {
      const res = await fetchCurrentUserPlaylists(0, accessToken);
      console.log(res);
      batch(() => {
        dispatch(setLibraryPlaylists(res.data.items, res.data.total));
        dispatch(setLibraryPlaylistsLoading(false));
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getCurrentUserFollowedArtists = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    let lastArtistId = "";

    try {
      const res = await fetchUserArtists(lastArtistId, accessToken);
      batch(() => {
        dispatch(
          setLibraryArtists(res.data.artists.items, res.data.artists.total)
        );
        dispatch(setLibraryLoading(false));
      });
      console.log(res);
    } catch (err) {
      let errorMsg = "Opps! Something went wrong!";
      let subMsg = "Please refresh the page and try again";
      batch(() => {
        dispatch(setError(errorMsg, subMsg));
        dispatch(setLibraryLoading(false));
      });
    }
  };
};

export const getUserTracks: ActionCreator<AppThunk> = (loading: boolean) => {
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

      const savedAlbumsRes = trackIds
        ? await checkCurrentUserSavedTracks(trackIds, accessToken)
        : { data: [] };

      console.log(res.data);
      batch(() => {
        dispatch(setLibraryTracks(res.data.items, res.data.total));
        dispatch(setTrackLikes([...savedAlbumsRes.data]));
        dispatch(setLibraryLoading(false));
      });
    } catch (err) {
      let errorMsg = "Opps! Something went wrong!";
      let subMsg = "Please refresh the page and try again";
      batch(() => {
        dispatch(setError(errorMsg, subMsg));
        dispatch(setLibraryLoading(false));
      });
    }
  };
};

export const getUsersAlbums: ActionCreator<AppThunk> = (loading: boolean) => {
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

      const savedAlbumsRes = albumIds
        ? await checkCurrentUserSavedAlbums(albumIds, accessToken)
        : { data: [] };

      console.log(res.data);
      batch(() => {
        dispatch(setLibraryAlbums(res.data.items, res.data.total));
        dispatch(setAlbumLikes([...savedAlbumsRes.data]));
        dispatch(setLibraryLoading(false));
      });
    } catch (err) {
      let errorMsg = "Opps! Something went wrong!";
      let subMsg = "Please refresh the page and try again";
      batch(() => {
        dispatch(setError(errorMsg, subMsg));
        dispatch(setLibraryLoading(false));
      });
    }
  };
};
