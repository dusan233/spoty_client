import { TrackSimplified } from ".";
import { MusicActionTypes} from '../actions/actionTypes';

export interface MusicState {
    playing: boolean;
    currentSelectedSong: TrackSimplified | null;
    nextUpSongs: TrackSimplified[];
    queueSongs: TrackSimplified[];
    currentListId: string;
}

export interface SetCurrentSelectedSong {
    type: MusicActionTypes.SET_CURRENT_SELECTED_SONG,
    payload: TrackSimplified
}

export interface SetNextUpSongs {
    type: MusicActionTypes.SET_NEXT_UP_SONGS,
    payload: TrackSimplified[]
}

export type MusicActions = SetCurrentSelectedSong 
| SetNextUpSongs