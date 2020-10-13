import { api } from "../../axios";
import { Dispatch } from "redux";
import { RootState } from "../reducers/index";
import {
  ISetAlbumLikes,
  ISetTrackLikes,
  SetArtistLikes,
  SetCreatingPlaylist,
  SetPlaylistLikes,
  SetUserData,
} from "../types/user";
import { PlaylistFull } from "../types/playlist";
import {
  removeLibraryPlaylist,
  addLibraryPlaylist,
  editLibraryPlaylist,
} from "./library";
import { UserActionTypes } from "./actionTypes";
import { ActionCreator } from "redux";
import { batch } from "react-redux";

export const checkUserSavedPlaylist = (
  playlistId: string,
  userIds: string,
  accessToken: string | undefined
) => {
  return api.get(`/playlists/${playlistId}/followers/contains`, {
    params: {
      ids: userIds,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const checkUserFollowedArtists = (
  artistId: string | undefined,
  accessToken: string | undefined
) => {
  return api.get("/me/following/contains", {
    params: {
      ids: artistId,
      type: "artist",
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const checkCurrentUserSavedTracks = (
  trackIds: string,
  accessToken: string | undefined
) => {
  return api.get<boolean[]>("/me/tracks/contains", {
    params: {
      ids: trackIds,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const checkCurrentUserSavedAlbums = (
  albumIds: string,
  accessToken: string | undefined
) => {
  return api.get("/me/albums/contains", {
    params: {
      ids: albumIds,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const setTrackLikes: ActionCreator<ISetTrackLikes> = (
  tracksLikes: boolean[],
  action: string = ""
) => ({
  type: UserActionTypes.SET_TRACKS_LIKES,
  payload: tracksLikes,
  action,
});

export const setAlbumLikes: ActionCreator<ISetAlbumLikes> = (
  albumLikes: boolean[],
  action: string = ""
) => ({
  type: UserActionTypes.SET_ALBUM_LIKES,
  payload: albumLikes,
  action,
});

export const setPlaylistLikes: ActionCreator<SetPlaylistLikes> = (
  playlistLikes: boolean[],
  action: string = ""
) => ({
  type: UserActionTypes.SET_PLAYLIST_LIKES,
  payload: playlistLikes,
  action,
});

export const setArtistLikes: ActionCreator<SetArtistLikes> = (
  artistLikes: boolean[]
) => ({
  type: UserActionTypes.SET_ARTISTS_LIKES,
  payload: artistLikes,
});

export const setCreatingPlaylist: ActionCreator<SetCreatingPlaylist> = (
  loading: boolean
) => ({
  type: UserActionTypes.SET_CREATING_PLAYLIST,
  payload: loading,
});

export const setUserData: ActionCreator<SetUserData> = (
  name: string,
  image: string,
  product: string,
  userId: string
) => ({
  type: UserActionTypes.SET_USER_DATA,
  payload: {
    name,
    image,
    product,
    userId,
  },
});

export const getCurrentUserData = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    try {
      const res = await api.get("/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      console.log(res);
      dispatch(
        setUserData(
          res.data.display_name,
          res.data.images[0].url,
          res.data.product,
          res.data.id
        )
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const saveRemoveAlbumsForCurrentUser = (
  albumIds: string,
  index: number,
  action: string
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const albumLikes = getState().user.albumLikes;

    try {
      const method = action === "save" ? "PUT" : "DELETE";
      console.log(method);
      const response = await api({
        method,
        url: "/me/albums",
        params: {
          ids: albumIds,
        },

        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      console.log(response);
      if (response.status === 200) {
        const likes = [...albumLikes];
        likes[index] = !likes[index];
        dispatch(setAlbumLikes(likes));
      }
    } catch (err) {
      console.log(err, "ds");
    }
  };
};

export const createPlaylist = (name: string, description: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const userId = getState().user.userId;
    dispatch(setCreatingPlaylist(true));
    try {
      const res = await api.post(
        `/users/${userId}/playlists`,
        { name, description },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      batch(() => {
        dispatch(setCreatingPlaylist(false));
        dispatch(addLibraryPlaylist(res.data));
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const editPlaylistDetails = (name: string, description: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const playlistId = getState().playlist.id;
    dispatch(setCreatingPlaylist(true));
    try {
      const res = await api.put(
        `/playlists/${playlistId}`,
        { name, description },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      batch(() => {
        dispatch(editLibraryPlaylist(name, playlistId));
        dispatch(setCreatingPlaylist(false));
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
};

export const followUnfollowArtistForCurrentUser = (
  artistId: string | undefined,
  action: string
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const artisFollows = getState().user.artistsLikes;
    try {
      const method = action === "save" ? "PUT" : "DELETE";
      const res = await api({
        method: method,
        params: {
          type: "artist",
          ids: artistId,
        },
        url: "/me/following",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      dispatch(setArtistLikes([!artisFollows[0]]));
    } catch (err) {
      console.log(err);
    }
  };
};

export const saveRemovePlaylistForCurrentUser = (
  playlistId: string,
  index: number,
  action: string,
  name: string | undefined
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const playlistLikes = getState().user.playlistLikes;
    try {
      const method = action === "save" ? "PUT" : "DELETE";
      const res = await api({
        method: method,
        url: `/playlists/${playlistId}/followers`,
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (res.status === 200) {
        const likes = [...playlistLikes];
        likes[index] = !likes[index];
        if (method === "DELETE") {
          batch(() => {
            dispatch(setPlaylistLikes(likes));
            dispatch(removeLibraryPlaylist(playlistId));
          });
        } else {
          const response = await api.get<PlaylistFull>(
            `/playlists/${playlistId}`,
            {
              headers: {
                Authorization: "Bearer " + accessToken,
              },
            }
          );

          batch(() => {
            dispatch(setPlaylistLikes(likes));
            dispatch(addLibraryPlaylist(response.data));
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const saveRemoveTracksForCurrentUser = (
  trackIds: string,
  index: number,
  action: string
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const tracksLikes = getState().user.trackLikes;
    try {
      const method = action === "save" ? "PUT" : "DELETE";
      console.log(method);
      const response = await api({
        method,
        url: "/me/tracks",
        params: {
          ids: trackIds,
        },

        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      console.log(response);
      if (response.status === 200) {
        const likes = [...tracksLikes];
        likes[index] = !likes[index];
        dispatch(setTrackLikes(likes));
      }
    } catch (err) {
      console.log(err, "ds");
    }
  };
};
