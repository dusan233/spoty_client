import {MusicState, MusicActions} from '../types/music';
import { MusicActionTypes } from '../actions/actionTypes';

const initialState: MusicState = {
    playing: false,
    currentSelectedSong: null,
    queueSongs: [],
    nextUpSongs: [],
    currentListId: ""
}

const reducer = (state = initialState, action: MusicActions) => {
    switch(action.type) {
        case MusicActionTypes.SET_CURRENT_SELECTED_SONG:
            return {
                ...state,
                currentSelectedSong: action.payload
            }
        case MusicActionTypes.SET_NEXT_UP_SONGS:
            return {
                ...state,
                nextUpSongs: action.payload
            }
        default:
            return state
    }
}

export default reducer;