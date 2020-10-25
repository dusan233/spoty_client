import { AlbumActionTypes } from "../actions/actionTypes";
import { ImageObject, TrackSimplified } from "./index";
import { ArtistSimplified } from "./artist";

export interface AlbumState {
  name: string;
  owner: ArtistSimplified[];
  img: string | undefined;
  tracks: TrackSimplified[];
  loading: boolean;
  id: string;
  total: number;
  type: string;
  date: string;
}

//actions

export interface ISetAlbumLoading {
  type: AlbumActionTypes.SET_ALBUM_LOADING;
  payload: boolean;
}

export interface IAddMoreAlbumTracks {
  type: AlbumActionTypes.ADD_MORE_ALBUM_TRACKS;
  payload: TrackSimplified[];
}

export interface ISetAlbumData {
  type: AlbumActionTypes.SET_ALBUM_DATA;
  payload: {
    img: string | undefined;
    name: string;
    owner: ArtistSimplified[];
    tracks: TrackSimplified[];
    id: string;
    total: number;
    type: string;
    date: string;
  };
}

export type AlbumActions =
  | ISetAlbumLoading
  | ISetAlbumData
  | IAddMoreAlbumTracks;

//other album types

export interface AlbumSimplified {
  id: string;
  name: string;
  images: ImageObject[];
  artists: ArtistSimplified[];
  total_tracks: number;
}

export interface MoreAlbumTracks {
  items: TrackSimplified[];
  total: number;
}

export interface SavedAlbum {
  added_at: string;
  album: AlbumFull;
}

export interface AlbumFull extends AlbumSimplified {
  album_type: string;
  release_date: string;
  tracks: {
    total: number;
    items: TrackSimplified[];
  };
}

export interface NewReleases {
  albums: {
    items: AlbumSimplified[];
  };
}
