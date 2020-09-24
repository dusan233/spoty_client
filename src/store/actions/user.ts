import { api } from "../../axios";
import { Dispatch } from "redux";
import { RootState } from "../reducers/index";
import { ISetTrackLikes } from "../types/user";
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

export const setTrackLikes: ActionCreator<ISetTrackLikes> = (
  tracksLikes: boolean[]
) => ({
  type: UserActionTypes.SET_TRACKS_LIKES,
  payload: tracksLikes,
});

export const saveTracksForCurrentUser = (trackIds: string, index: number) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const tracksLikes = getState().user.trackLikes;
    console.log(accessToken);
    console.log(index);
    try {
      const response = await api.put("/me/tracks", null, {
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
