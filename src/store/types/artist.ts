import { ImageObject, TrackFull } from "./index";
import { ArtistActionTypes } from "../actions/actionTypes";
import { AlbumSimplified } from "./album";
export interface ArtistState {
  name: string;
  followers: number;
  image: string;
  loading: boolean;
  artists: ArtistFull[];
  topTracks: TrackFull[];
  albums: AlbumSimplified[];
  albumsTotal: number;
}

//actions

export interface SetArtistLoading {
  type: ArtistActionTypes.SET_ARTIST_LOADING;
  payload: boolean;
}

export interface SetMoreAlbums {
  type: ArtistActionTypes.SET_MORE_ALBUMS;
  payload: AlbumSimplified[];
}

export interface SetArtistData {
  type: ArtistActionTypes.SET_ARTIST_DATA;
  payload: {
    name: string;
    image: string;
    followers: number;
    topTracks: TrackFull[];
    artists: ArtistFull[];
    albums: AlbumSimplified[];
    albumsTotal: number;
  };
}

export type ArtistActions = SetArtistLoading | SetArtistData | SetMoreAlbums;
//other types

export interface ArtistSimplified {
  name: string;
  id: string;
}
export interface ArtistFull extends ArtistSimplified {
  images: ImageObject[];
  followers: {
    total: number;
  };
  genres: string[];
}
export interface ArtistTopTracksResponse {
  tracks: TrackFull[];
}
export interface ArtistSimularArtistsResponse {
  artists: ArtistFull[];
}
