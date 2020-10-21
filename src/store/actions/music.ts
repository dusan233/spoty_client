import { batch } from "react-redux";
import { Dispatch, ActionCreator } from "redux"
import { RootState } from "../reducers"
import { TrackSimplified } from "../types";
import { MusicActionTypes } from "./actionTypes";
import {getMoreTracks} from './playlist';
import { getMoreAlbumTracks } from './album';
import {checkCurrentUserSavedTracks, setTrackLikes} from './user';
import { setDurCurTime, SetPlaying, setSlidersValue } from "../types/music";


export const setCurrentSelectedSong = (song: TrackSimplified, trackIndex: number, listId: string ) => ({ 
    type: MusicActionTypes.SET_CURRENT_SELECTED_SONG,
    payload: {
        track: song,
        trackIndex,
        listId
    }
})

export const setNextUpSongs = (songs: TrackSimplified[]) => ({
    type: MusicActionTypes.SET_NEXT_UP_SONGS,
    payload: songs 
})

export const setPlaying: ActionCreator<SetPlaying> = (playing: boolean) => ({
    type: MusicActionTypes.SET_PLAYING,
    payload: playing
})

export const setRepeat = (type: string) => ({
    type: MusicActionTypes.SET_REPEAT,
    payload: type
})

export const setTime: ActionCreator<setDurCurTime> = (durationTime: string, currentTime: string) => ({  
    type: MusicActionTypes.SET_TIME,
    payload: {
        duration: durationTime,
        currentTime
    }
})

export const setProgressValues: ActionCreator<setSlidersValue> = (sliderPercent: number, progressBarPercent: number) => ({
    type: MusicActionTypes.SET_SLIDERS_VALUES,
    payload: {
        sliderPercent,
        progressBarPercent
    }
})

export const playPlaylistSongs = ( playlistId: string, songIndex: number, endIndex: number ) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken;

        try {
            const resSongs = await getMoreTracks(songIndex, playlistId, accessToken, endIndex)
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
                dispatch(setCurrentSelectedSong(resSongs.data.items[0].track, songIndex, playlistId))
                dispatch(setTrackLikes([...savedTracksRes.data]))
                dispatch(setNextUpSongs(resSongs.data.items.map(item => item.track).slice(1, 51)))
            })
        }catch(err) {
            console.log(err)
        }
    }
}

// export const playAlbumSongs = (albumId: string) => {
//     return async (dispatch: Dispatch, getState: () => RootState) => {
//         const accessToken = getState().auth.accessToken;
//         try {
//             const resSongs = await getMoreAlbumTracks()
//         }catch(err) {

//         }
//     }
// }