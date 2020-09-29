import { PlaylistActionTypes } from "../actions/actionTypes";
import { ImageObject, UserPublic, TrackPlaylist } from "./index";

export interface PlaylistState {
  name: string;
  owner: string;
  ownerId: string;
  img: string | undefined;
  description: string | null;
  followers: number;
  tracks: PlaylistTrackObject[];
  loading: boolean;
  id: string;
  total: number;
  type: string;
}

//actions

export interface ISetPlaylistLoading {
  type: PlaylistActionTypes.SET_PLAYLIST_LOADING;
  payload: boolean;
}

export interface IAddMoreTracks {
  type: PlaylistActionTypes.ADD_MORE_TRACKS;
  payload: PlaylistTrackObject[];
}

export interface ISetPlaylistData {
  type: PlaylistActionTypes.SET_PLAYLIST_DATA;
  payload: {
    description: string | null;
    img: string;
    name: string;
    followers: number;
    owner: string;
    ownerId: string;
    tracks: PlaylistTrackObject[];
    id: string;
    total: number;
    type: string;
  };
}

export type PlaylistActions =
  | ISetPlaylistLoading
  | ISetPlaylistData
  | IAddMoreTracks;

// types for playlists

export interface PlaylistSimplified {
  id: string;
  description: string | null;
  images: ImageObject[];
  name: string;
  owner: UserPublic;
  tracks: {
    total: number;
  };
}
export interface PlaylistFull extends PlaylistSimplified {
  followers: {
    total: number;
  };
  owner: UserPublic;
  type: string;
  tracks: {
    items: PlaylistTrackObject[];
    total: number;
  };
}

export interface MorePlaylistTracks {
  items: PlaylistTrackObject[];
}

export interface FeaturedPlaylists {
  playlists: {
    items: PlaylistSimplified[];
  };
}

export interface PlaylistTrackObject {
  track: TrackPlaylist;
}
