import { PlaylistActionTypes } from "./actionTypes";
import { Dispatch, ActionCreator } from "redux";
import { batch } from "react-redux";
import { setError } from "./error";
import { RootState } from "../reducers/index";
import { api } from "../../axios";
import { checkCurrentUserSavedTracks, checkUserSavedPlaylist } from "./user";
import { setTrackLikes, setPlaylistLikes } from "./user";
import {
  ISetPlaylistLoading,
  ISetPlaylistData,
  IAddMoreTracks,
  PlaylistFull,
  PlaylistTrackObject,
  MorePlaylistTracks,
  SetPlaylistTracks,
  EditPlaylist,
  SetAddingTrack,
} from "../types/playlist";
import { AppThunk } from "../types/index";
import { AxiosResponse } from "axios";

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

export const setTracks: ActionCreator<SetPlaylistTracks> = (
  tracks: PlaylistTrackObject[]
) => ({
  type: PlaylistActionTypes.SET_PLAYLIST_TRACKS,
  payload: tracks,
});

export const setPlaylistData: ActionCreator<ISetPlaylistData> = (
  description: string | null,
  img: string,
  name: string,
  followers: number,
  owner: string,
  ownerId: string,
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
    ownerId,
    tracks,
    id,
    total,
    type,
  },
});

export const getMoreTracks = (
  startIndex: number,
  playlistId: string | undefined,
  accessToken: string | undefined,
  endIndex: number = 50,
) => {
  return api.get<MorePlaylistTracks>(`/playlists/${playlistId}/tracks`, {
    params: {
      limit: endIndex,
      offset: startIndex,
      market: "US"
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const editPlaylist: ActionCreator<EditPlaylist> = (
  id: string,
  name: string,
  description: string
) => ({
  type: PlaylistActionTypes.EDIT_PLAYLIST,
  payload: {
    id,
    name,
    description,
  },
});

export const setAddingTrack: ActionCreator<SetAddingTrack> = (loading: boolean) => ({
  type: PlaylistActionTypes.SET_ADDING_TRACK,
  payload: loading
})

export const getPlaylistData: ActionCreator<AppThunk> = (
  playlistId: string | undefined
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const userId = getState().user.userId;
    dispatch(setPlaylistLoading(true));
    try {
      const response = await api.get<PlaylistFull>(`/playlists/${playlistId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      console.log(response);

      const savedPlaylistRes = checkUserSavedPlaylist(
        response.data.id,
        userId,
        accessToken
      );

      let trackIds = "";
      let trackIds2 = "";
      response.data.tracks.items.slice(0, 50).forEach((track) => {
        if (trackIds === " ") {
          trackIds += track.track.id;
        } else {
          trackIds += "," + track.track.id;
        }
      });

      const savedTracksPromise =
        trackIds.length > 0
          ? checkCurrentUserSavedTracks(trackIds, accessToken)
          : new Promise((resolve) => resolve({ data: [] }));

      response.data.tracks.items.slice(50, 100).forEach((track) => {
        if (trackIds2 === " ") {
          trackIds2 += track.track.id;
        } else {
          trackIds2 += "," + track.track.id;
        }
      });

      const savedTracksPromise2 =
        trackIds2.length > 0
          ? checkCurrentUserSavedTracks(trackIds2, accessToken)
          : new Promise((resolve) => resolve({ data: [] }));

      const likesRes = await Promise.all([
        savedTracksPromise,
        savedTracksPromise2,
        savedPlaylistRes,
      ]);

      batch(() => {
        dispatch(
          setPlaylistData(
            response.data.description,
            response.data.images[0]?.url,
            response.data.name,
            response.data.followers.total,
            response.data.owner.display_name,
            response.data.owner.id,
            response.data.tracks.items,
            response.data.id,
            response.data.tracks.total,
            response.data.type
          )
        );
        dispatch(
          setPlaylistLikes([...(likesRes[2] as { data: boolean[] }).data])
        );
        dispatch(
          setTrackLikes([
            ...(likesRes[0] as { data: boolean[] }).data,
            ...(likesRes[1] as { data: boolean[] }).data,
          ])
        );
        dispatch(setPlaylistLoading(false));
      });
    } catch (err) {
      console.log(err);
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

export const addTracksToPlaylist = (trackUri: string, playlistId: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    dispatch(setAddingTrack(true))
    try {
      const res = await api.post(`/playlists/${playlistId}/tracks`, null, {
        params: {
          uris: trackUri,
        },
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      
      dispatch(setAddingTrack(false));
      return res;
    } catch (err) {
      console.log(err);
    }
  };
};

export const removeTracksFromPlaylist = (
  trackUri: string,
  index: number,
  playlistId: string | undefined
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    const tracks = getState().playlist.tracks;
    const trackLikes = getState().user.trackLikes;
    try {
      console.log(playlistId);
      const res = await api.delete(`/playlists/${playlistId}/tracks`, {
        data: JSON.stringify({
          tracks: [{ uri: trackUri, position: index }],
        }),
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      });
      const newTracks = tracks.filter((_, i) => i !== index);
      const newLikes = trackLikes.filter((_, i) => i !== index);
      batch(() => {
        dispatch(setTracks(newTracks));
        dispatch(setTrackLikes(newLikes));
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
};
