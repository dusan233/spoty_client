import {MusicState, MusicActions} from '../types/music';
import { MusicActionTypes } from '../actions/actionTypes';

const initialState: MusicState = {
    playing: false,
    currentSelectedSong: null,
    queueSongs: [],
    nextUpSongs: [],
    currentListId: "",
    currentSongIndex: 0,
    repeatType: "",
    durationTime: "0:00",
    currentTime: "0:00",
    sliderPercent: 0,
    progressBarPercent: -100,
    volume: 0.5,
    muted: false,
    total: 0,
    type: ""
}

const reducer = (state = initialState, action: MusicActions) => {
    switch(action.type) {
        case MusicActionTypes.SET_CURRENT_SELECTED_SONG:
            return {
                ...state,
                currentSelectedSong: action.payload.track,
                currentSongIndex: action.payload.trackIndex,
                currentListId: action.payload.listId,
                total: action.payload.total,
                type: action.payload.type
            }
        case MusicActionTypes.SET_NEXT_UP_SONGS:
            return {
                ...state,
                nextUpSongs: action.payload
            }
        case MusicActionTypes.SET_SLIDERS_VALUES:
            return {
                ...state,
                sliderPercent: action.payload.sliderPercent,
                progressBarPercent: action.payload.progressBarPercent
            }
        case MusicActionTypes.SET_TIME:
            return {
                ...state,
                currentTime: action.payload.currentTime,
                durationTime: action.payload.duration
            }
        case MusicActionTypes.SET_VOLUME:
            return {
                ...state,
                volume: action.payload
            }
        case MusicActionTypes.SET_PLAYING:
            return {
                ...state,
                playing: action.payload
            }
        case MusicActionTypes.SET_MUTE:
            return {
                ...state,
                muted: action.payload
            }
        case MusicActionTypes.SET_REPEAT:
            return {
                ...state,
                repeatType: action.payload
            }
        default:
            return state
    }
}

export default reducer;