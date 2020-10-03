import { ArtistActionTypes } from "./actionTypes";
import { Dispatch, ActionCreator } from "redux";
import { RootState } from "../reducers/index";
import {
  ArtistFull,
  SetArtistData,
  SetArtistLoading,
  ArtistTopTracksResponse,
  ArtistSimularArtistsResponse,
} from "../types/artist";
import {
  checkCurrentUserSavedTracks,
  checkUserFollowedArtists,
  setArtistLikes,
  setTrackLikes,
} from "./user";
import { api } from "../../axios";
import { batch } from "react-redux";
import { TrackFull } from "../types";
import { AlbumSimplified } from "../types/album";

export const setArtistLoading: ActionCreator<SetArtistLoading> = (
  loading: boolean
) => ({
  type: ArtistActionTypes.SET_ARTIST_LOADING,
  payload: loading,
});

export const setArtistData: ActionCreator<SetArtistData> = (
  name: string,
  followers: number,
  image: string,
  artists: ArtistFull[],
  topTracks: TrackFull[],
  albums: AlbumSimplified[],
  albumsTotal: number
) => ({
  type: ArtistActionTypes.SET_ARTIST_DATA,
  payload: {
    name,
    image,
    followers,
    artists,
    topTracks,
    albums,
    albumsTotal,
  },
});

export const fetchArtistAlbums = (
  artistId: string | undefined,
  accessToken: string | undefined,
  albumType: string,
  offset: number,
  limit: number
) => {
  return api.get<{ items: AlbumSimplified[]; total: number }>(
    `/artists/${artistId}/albums`,
    {
      params: {
        include_groups: albumType,
        offset: offset,
        limit: limit,
      },
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
};

export const fetchArtistData = (
  artistId: string | undefined,
  accessToken: string | undefined
) => {
  return api.get<ArtistFull>(`/artists/${artistId}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const fetchArtistTopTracks = (
  artistId: string | undefined,
  accessToken: string | undefined
) => {
  return api.get<ArtistTopTracksResponse>(`/artists/${artistId}/top-tracks`, {
    params: {
      market: "us",
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const fetchArtistSimylarArtists = (
  artistId: string | undefined,
  accessToken: string | undefined
) => {
  return api.get<ArtistSimularArtistsResponse>(
    `/artists/${artistId}/related-artists`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
};

export const getArtist = (artistId: string | undefined) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    dispatch(setArtistLoading(true));
    Promise.all([
      fetchArtistData(artistId, accessToken),
      fetchArtistTopTracks(artistId, accessToken),
      fetchArtistSimylarArtists(artistId, accessToken),
      fetchArtistAlbums(artistId, accessToken, "single,album", 0, 20),
    ])
      .then((res) => {
        let trackIds = "";
        res[1].data.tracks.slice(0, 50).forEach((track: TrackFull) => {
          if (trackIds === " ") {
            trackIds += track.id;
          } else {
            trackIds += "," + track.id;
          }
        });

        return Promise.all([
          checkCurrentUserSavedTracks(trackIds, accessToken),
          checkUserFollowedArtists(artistId, accessToken),
        ]).then((savedRes) => {
          batch(() => {
            dispatch(
              setArtistData(
                res[0].data.name,
                res[0].data.followers.total,
                res[0].data.images[0].url,
                res[2].data.artists,
                res[1].data.tracks,
                res[3].data.items,
                res[3].data.total
              )
            );
            dispatch(setArtistLikes(savedRes[1].data));
            dispatch(setTrackLikes(savedRes[0].data));
            dispatch(setArtistLoading(false));
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
