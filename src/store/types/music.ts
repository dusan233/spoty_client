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
    durationTime: string;
    currentTime: string;
    sliderPercent: number;
    progressBarPercent: number;
    volume: number;
    muted: boolean;
    total: number;
}

export interface SetCurrentSelectedSong {
    type: MusicActionTypes.SET_CURRENT_SELECTED_SONG,
    payload: {
        track: TrackSimplified,
        trackIndex: number,
        listId: string,
        total: number
    }
}

export interface setSlidersValue {
    type: MusicActionTypes.SET_SLIDERS_VALUES,
    payload: {
        sliderPercent: number,
        progressBarPercent: number
    }
}

export interface setRepeat {
    type: MusicActionTypes.SET_REPEAT,
    payload: string
}

export interface SetVolume {
    type: MusicActionTypes.SET_VOLUME,
    payload: number
}

export interface SetMute {
    type: MusicActionTypes.SET_MUTE,
    payload: boolean
}

export interface setDurCurTime {
    type: MusicActionTypes.SET_TIME,
    payload: {
        duration: string,
        currentTime: string
    }
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
| SetNextUpSongs | SetPlaying | setRepeat | setDurCurTime | setSlidersValue | SetVolume
| SetMute