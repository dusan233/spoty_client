import { AlbumActionTypes } from "./actionTypes";
import { Dispatch, ActionCreator } from "redux";
import { batch } from "react-redux";
import { RootState } from "../reducers/index";
import { api } from "../../axios";
import {
  ISetAlbumLoading,
  ISetAlbumData,
  AlbumFull,
  MoreAlbumTracks,
  IAddMoreAlbumTracks,
} from "../types/album";
import { AppThunk, TrackSimplified } from "../types/index";
import { ArtistSimplified } from "../types/artist";

export const setAlbumLoading: ActionCreator<ISetAlbumLoading> = (
  loading: boolean
) => ({
  type: AlbumActionTypes.SET_ALBUM_LOADING,
  payload: loading,
});

export const addMoreAlbumTracks: ActionCreator<IAddMoreAlbumTracks> = (
  tracks: TrackSimplified[]
) => ({
  type: AlbumActionTypes.ADD_MORE_ALBUM_TRACKS,
  payload: tracks,
});

export const setAlbumData: ActionCreator<ISetAlbumData> = (
  img: string | undefined,
  name: string,
  owner: ArtistSimplified[],
  tracks: TrackSimplified[],
  id: string,
  total: number,
  type: string,
  date: string
) => ({
  type: AlbumActionTypes.SET_ALBUM_DATA,
  payload: {
    img,
    name,
    owner,
    tracks,
    id,
    total,
    type,
    date,
  },
});

export const getMoreAlbumTracks = (
  startIndex: number,
  albumId: string | undefined,
  accessToken: string | undefined
) => {
  return api.get<MoreAlbumTracks>(`/albums/${albumId}/tracks`, {
    params: {
      limit: 50,
      offset: startIndex,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const getAlbumData: ActionCreator<AppThunk> = (
  albumId: string | undefined
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    dispatch(setAlbumLoading(true));
    const data = await api.get<AlbumFull>(`/albums/${albumId}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    console.log(data);
    batch(() => {
      dispatch(
        setAlbumData(
          data.data.images[1]?.url,
          data.data.name,
          data.data.artists,
          data.data.tracks.items,
          data.data.id,
          data.data.tracks.total,
          data.data.album_type,
          data.data.release_date
        )
      );
      dispatch(setAlbumLoading(false));
    });
  };
};
