import { batch } from "react-redux";
import { Dispatch, ActionCreator } from "redux"
import { RootState } from "../reducers"
import { TrackFull, TrackSimplified } from "../types";
import { MusicActionTypes } from "./actionTypes";
import {getMoreTracks} from './playlist';
import { getMoreAlbumTracks } from './album';
import {checkCurrentUserSavedTracks, setTrackLikes} from './user';
import { setDurCurTime, SetMute, SetPlaying, setSlidersValue, SetVolume } from "../types/music";
import { api } from "../../axios";
import { fetchArtistTopTracks } from "./artist";
import { fetchUserTracks } from "./library";
import { getSearchData } from "./search";
import { SearchResultPlaylists } from "../types/search";



export const setCurrentSelectedSong = (song: TrackSimplified, trackIndex: number, listId: string, total: number, type: string ) => ({ 
    type: MusicActionTypes.SET_CURRENT_SELECTED_SONG,
    payload: {
        track: song,
        trackIndex,
        listId,
        total,
        type
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

export const setVolume: ActionCreator<SetVolume> = (volume: number) => ({
    type: MusicActionTypes.SET_VOLUME,
    payload: volume
})

export const setMute: ActionCreator<SetMute> = (muted: boolean) => ({
    type: MusicActionTypes.SET_MUTE,
    payload: muted
})

export const playPlaylistSongs = ( playlistId: string, songIndex: number, endIndex: number ) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken;

        try {
            const resSongs = await getMoreTracks(songIndex, playlistId, accessToken, endIndex)
           
            batch(() => {
                dispatch(setCurrentSelectedSong(resSongs.data.items[0].track, songIndex, playlistId, resSongs.data.total, "playlist"))
                dispatch(setNextUpSongs(resSongs.data.items.map(item => item.track).slice(1, 51)))
            })
        }catch(err) {
            console.log(err)
        }
    }
}


export const playArtistSongs = (listId: string, songIndex: number, endIndex: number) => {
     return async (dispatch: Dispatch, getState: () => RootState ) => {
        const accessToken = getState().auth.accessToken;

        try {
            const resSongs = await fetchArtistTopTracks(listId, accessToken);
            batch(() => {
                dispatch(setCurrentSelectedSong(resSongs.data.tracks[songIndex], songIndex, listId, resSongs.data.tracks.length, "artist"))
                dispatch(setNextUpSongs(resSongs.data.tracks.slice(songIndex + 1, resSongs.data.tracks.length)))
            })
        }catch(err) {
            console.log(err)
        }
     }
}

export const playSearchedSongs = (listId: string, songIndex: number, endIndex: number) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken;

        try{
            const resSongs = await api.get<{tracks: {
                items: TrackFull[],
                total: number
            }}>("https://api.spotify.com/v1/search", {
                params: {
                  q: listId,
                  type: "track",
                  limit: 1,
                  offset: songIndex,
                },
                headers: {
                  Authorization: "Bearer " + accessToken,
                },
              });
            if("tracks" in resSongs.data) {
                batch(() => {
                    dispatch(setCurrentSelectedSong(resSongs.data.tracks.items[0] , songIndex, resSongs.data.tracks.items[0].id, 1, "search"))
                    dispatch(setNextUpSongs([]))
                })
            }
            
        }catch(err) {
            console.log(err)
        }
    }
}

export const playLikedSongs = (listId: string, songIndex: number, endIndex: number) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken;

        try {
            const resSongs = await fetchUserTracks(songIndex, accessToken);

            batch(() => {
                dispatch(setCurrentSelectedSong(resSongs.data.items[0].track, songIndex, listId, resSongs.data.total, "liked"))
                dispatch(setNextUpSongs(resSongs.data.items.map(item => item.track).slice(1, 51)))
            })
        }catch(err) {
            console.log(err)
        }
    }
}

export const playAlbumSongs = (albumId: string, songIndex: number, endIndex: number) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const accessToken = getState().auth.accessToken;
        try {
            const resSongs = await getMoreAlbumTracks(songIndex, albumId, accessToken);
            const resCurrentSong = await api.get<TrackFull>(`/tracks/${resSongs.data.items[0].id}`, {
                params: {
                    market: "US"
                },
                headers: {
                    Authorization: "Bearer " + accessToken,
                  },
            })

            batch(() => {
                dispatch(setCurrentSelectedSong(resCurrentSong.data, songIndex, albumId, resSongs.data.total, "album"))
                dispatch(setNextUpSongs(resSongs.data.items.map(item => item).slice(1, 51)))
            })
        }catch(err) {
            console.log(err)
        }
    }
}