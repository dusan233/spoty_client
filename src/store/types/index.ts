import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducers/index";
import { Action } from "redux";
import { ArtistSimplified } from "./artist";
import { AlbumSimplified } from "./album";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<any>
>;

// other types
export interface ImageObject {
  url: string;
  height: number;
  width: number;
}

export interface UserPublic {
  display_name: string | null;
  id: string;
}
export interface TrackSimplified {
  artists: ArtistSimplified[];
  explicit: boolean;
  id: string;
  duration_ms: number;
  name: string;
  preview_url: string | null;
}

export interface SavedTrack {
  added_at: string;
  track: TrackFull;
}

export interface TrackPlaylist extends TrackSimplified {
  popularity: number;
  album: AlbumSimplified;
}

export interface TrackFull extends TrackPlaylist {
  href: string;
}
