import { TrackSimplified } from ".";
import { MusicActionTypes} from '../actions/actionTypes';

export interface MusicState {
    playing: boolean;
    currentSelectedSong: TrackSimplified | null;
    nextUpSongs: TrackSimplified[];
    queueSongs: TrackSimplified[];
    currentListId: string;
    currentSongIndex: number;
    repeatType: string;
}

export interface SetCurrentSelectedSong {
    type: MusicActionTypes.SET_CURRENT_SELECTED_SONG,
    payload: {
        track: TrackSimplified,
        trackIndex: number,
        listId: string
    }
}

export interface setRepeat {
    type: MusicActionTypes.SET_REPEAT,
    payload: string
}

export interface SetPlaying {
    type: MusicActionTypes.SET_PLAYING,
    payload: boolean
}

export interface SetNextUpSongs {
    type: MusicActionTypes.SET_NEXT_UP_SONGS,
    payload: TrackSimplified[]
}

export type MusicActions = SetCurrentSelectedSong 
| SetNextUpSongs | SetPlaying | setRepeat