import { PlaylistActionTypes } from "./actionTypes";
import { Dispatch, ActionCreator } from "redux";
import { batch } from "react-redux";
import { setError } from "./error";
import { RootState } from "../reducers/index";
import { api } from "../../axios";
import {
  ISetPlaylistLoading,
  ISetPlaylistData,
  IAddMoreTracks,
  PlaylistFull,
  PlaylistTrackObject,
  MorePlaylistTracks,
} from "../types/playlist";
import { AppThunk } from "../types/index";

export const setPlaylistLoading: ActionCreator<ISetPlaylistLoading> = (
  loading: boolean
) => ({
  type: PlaylistActionTypes.SET_PLAYLIST_LOADING,
  payload: loading,
});

export const addMoreTracks: ActionCreator<IAddMoreTracks> = (
  tracks: PlaylistTrackObject[]
) => ({
  type: PlaylistActionTypes.ADD_MORE_TRACKS,
  payload: tracks,
});

export const setPlaylistData: ActionCreator<ISetPlaylistData> = (
  description: string | null,
  img: string,
  name: string,
  followers: number,
  owner: string,
  tracks: PlaylistTrackObject[],
  id: string,
  total: number,
  type: string
) => ({
  type: PlaylistActionTypes.SET_PLAYLIST_DATA,
  payload: {
    description,
    img,
    name,
    followers,
    owner,
    tracks,
    id,
    total,
    type,
  },
});

export const getMoreTracks = (
  startIndex: number,
  playlistId: string | undefined,
  accessToken: string | undefined
) => {
  return api.get<MorePlaylistTracks>(`/playlists/${playlistId}/tracks`, {
    params: {
      limit: 50,
      offset: startIndex,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const getPlaylistData: ActionCreator<AppThunk> = (
  playlistId: string | undefined
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    batch(() => {
      dispatch(setPlaylistLoading(true));
      dispatch(setError("", ""));
    });
    try {
      const response = await api.get<PlaylistFull>(`/playlists/${playlistId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      console.log(response);
      batch(() => {
        dispatch(
          setPlaylistData(
            response.data.description,
            response.data.images[0]?.url,
            response.data.name,
            response.data.followers.total,
            response.data.owner.display_name,
            response.data.tracks.items,
            response.data.id,
            response.data.tracks.total,
            response.data.type
          )
        );
        dispatch(setPlaylistLoading(false));
      });
    } catch (err) {
      let errorMsg: string;
      let subMsg: string;
      if (err.response.status === 404) {
        errorMsg = "Couldn't find that playlist";
        subMsg = "Search for something else?";
      } else {
        errorMsg = "Opps! Something went wrong!";
        subMsg = "Please refresh the page and try again";
      }
      batch(() => {
        dispatch(setPlaylistLoading(false));
        dispatch(setError(errorMsg, subMsg));
      });
    }
  };
};
