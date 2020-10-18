import { batch } from "react-redux";
import { Dispatch } from "redux"
import { RootState } from "../reducers"
import { TrackSimplified } from "../types";
import { MusicActionTypes } from "./actionTypes";
import {getMoreTracks} from './playlist';
import {checkCurrentUserSavedTracks, setTrackLikes} from './user';


export const setCurrentSelectedSong = (song: TrackSimplified ) => ({ 
    type: MusicActionTypes.SET_CURRENT_SELECTED_SONG,
    payload: song
})

export const setNextUpSongs = (songs: TrackSimplified[]) => ({
    type: MusicActionTypes.SET_NEXT_UP_SONGS,
    payload: songs 
})

export const playPlaylistSongs = ( playlistId: string ) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken;

        try {
            const resSongs = await getMoreTracks(0, playlistId, accessToken)
            let trackIds = "";
            resSongs.data.items.forEach((track) => {
                if (trackIds === " ") {
                  trackIds += track.track.id;
                } else {
                  trackIds += "," + track.track.id;
                }
              });
            const savedTracksRes = await checkCurrentUserSavedTracks(trackIds, accessToken)
              

            batch(() => {
                dispatch(setCurrentSelectedSong(resSongs.data.items[0].track))
                dispatch(setTrackLikes([...savedTracksRes.data]))
                dispatch(setNextUpSongs(resSongs.data.items.map(item => item.track).slice(1, 51)))
            })
        }catch(err) {
            console.log(err)
        }
    }
}