import { api } from "../../axios";
import { Action, Dispatch } from "redux";
import { RootState } from "../reducers/index";
import { ISetAlbumLikes, ISetTrackLikes, SetUserData } from "../types/user";
import { UserActionTypes } from "./actionTypes";
import { ActionCreator } from "redux";

export const checkCurrentUserSavedTracks = (
  trackIds: string,
  accessToken: string | undefined
) => {
  return api.get("/me/tracks/contains", {
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

export const setUserData: ActionCreator<SetUserData> = (
  name: string,
  image: string,
  product: string
) => ({
  type: UserActionTypes.SET_USER_DATA,
  payload: {
    name,
    image,
    product,
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
          res.data.product
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
