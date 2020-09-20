import { Dispatch, ActionCreator } from "redux";
import { fetchFeaturedPlaylists } from "./playlists";
import { RootState } from "../reducers/index";
import { HomeActionTypes } from "./actionTypes";
import { AppThunk } from "../types/index";
import { ISetHomeLoading, ISetHomeData } from "../types/home";
import { api } from "../../axios";
import { batch } from "react-redux";
import { NewReleases } from "../types/album";
import { AlbumSimplified } from "../types/album";
import { PlaylistSimplified } from "../types/playlist";

export const getNewReleases = (accessToken: string | undefined) => {
  return api.get<NewReleases>("/browse/new-releases", {
    params: {
      limit: 20,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const setHomeLoading: ActionCreator<ISetHomeLoading> = (
  loading: boolean
) => ({
  type: HomeActionTypes.SET_LOADING,
  payload: loading,
});

export const setHomeData: ActionCreator<ISetHomeData> = (
  featuredPlaylists: PlaylistSimplified[],
  newReleases: AlbumSimplified[]
) => ({
  type: HomeActionTypes.SET_DATA,
  payload: {
    featuredPlaylists,
    newReleases,
  },
});

export const getHomeData: ActionCreator<AppThunk> = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    dispatch(setHomeLoading(true));

    Promise.all([
      fetchFeaturedPlaylists(accessToken),
      getNewReleases(accessToken),
    ]).then((results) => {
      const featuredPlaylists = results[0].data.playlists.items;
      const newReleases = results[1].data.albums.items;
      batch(() => {
        dispatch(setHomeData(featuredPlaylists, newReleases));
        dispatch(setHomeLoading(false));
      });
    });
  };
};
