import React, { useCallback, useEffect, useRef } from 'react';
import NowPlayingStyles from './NowPlaying.module.css';
import {RiPlayListLine} from 'react-icons/ri';
import { RouteComponentProps, withRouter} from 'react-router-dom'
import {history} from '../../index';
import {connect, ConnectedProps} from 'react-redux';
import { RootState } from '../../store/reducers';
import { TrackSimplified } from '../../store/types';
import { setPlaying, setRepeat, playPlaylistSongs, playAlbumSongs} from '../../store/actions/music';
import {MdSkipPrevious, MdSkipNext, MdPlayArrow, MdRepeat, MdRepeatOne, MdPause} from 'react-icons/md';
import PlaybackBar from './PlaybackBar';
import PlaybackVolume from './PlaybackVolume';
import SongInfo from './SongInfo';

const mapStateToProps = (state: RootState) => ({
    isPlaying: state.music.playing,
    currentSelectedSong: state.music.currentSelectedSong,
    currentSongIndex: state.music.currentSongIndex,
    repeatType: state.music.repeatType,
    nextUpSongs: state.music.nextUpSongs,
    currentListId: state.music.currentListId,
    total: state.music.total,
    type: state.music.type
})
const mapDispatchToProps = {
    setPlaying,
    setRepeat,
    playPlaylistSongs,
    playAlbumSongs
}

const connector = connect(mapStateToProps, mapDispatchToProps);



type Props = RouteComponentProps & ConnectedProps<typeof connector>;

const NowPlaying: React.FC<Props> = ({location, total, type, nextUpSongs, currentListId, currentSongIndex, currentSelectedSong, repeatType, isPlaying, playPlaylistSongs, playAlbumSongs, setRepeat,  setPlaying}) => {

    const audio = useRef<HTMLAudioElement>();


    const nextTrack = useCallback(() => {
        if(!nextUpSongs.length) {
            
            if(type === "playlist") playPlaylistSongs(currentListId, 0, 50)
            if(type === "album") playAlbumSongs(currentListId, 0, 50);
        }else {
            const offset = currentSongIndex + 1;
            if(type === "playlist") playPlaylistSongs(currentListId, offset, 50);
            if(type === "album") playAlbumSongs(currentListId, offset, 50);
            
        }
        
    }, [currentListId, currentSongIndex, playPlaylistSongs, playAlbumSongs, type, nextUpSongs.length])

    const prevTrack = () => {
        if(currentSongIndex === 0) {
            const offset = total - 1
            if(type === "playlist") playPlaylistSongs(currentListId, offset, 50);
            if(type === "album") playAlbumSongs(currentListId, offset, 50);
        }else {
            const offset = currentSongIndex - 1;
            if(type === "playlist") playPlaylistSongs(currentListId, offset, 50);
            if(type === "album") playAlbumSongs(currentListId, offset, 50);
        }
        
    }

    useEffect(() => {
        if(!audio.current) audio.current = new Audio();

        if(currentSelectedSong && currentSelectedSong.preview_url !== null) {
            console.log('dadadaad')
            audio.current.src = ((currentSelectedSong as TrackSimplified).preview_url) as string;
            setPlaying(true);
            
        }else {
            //problem on first load.
            // nextTrack()
            if(currentSelectedSong) {
                nextTrack()
            }
        }

    }, [currentSelectedSong, setPlaying, nextTrack]);

    useEffect(() => {
        const onTrackEnded = (e: Event) => {
            if(repeatType === "repeat-one") {
                if(audio.current) {
                    audio.current.currentTime = 0;
                    audio.current.play()
                }
            }
            if(repeatType === "repeat") {
                if(!nextUpSongs.length) {
                    if(type === "playlist") playPlaylistSongs(currentListId, 0, 50)
                    if(type === "album") playAlbumSongs(currentListId, 0, 50);
                }else {
                    const offset = currentSongIndex + 1;
                    if(type === "playlist") playPlaylistSongs(currentListId, offset, 50);
                    if(type === "album") playAlbumSongs(currentListId, offset, 50);
                }
            }
            if(repeatType === "") {
                
                if(!nextUpSongs.length) {
                    setPlaying(false)
                }else {
                    const offset = currentSongIndex + 1;
                    if(type === "playlist") playPlaylistSongs(currentListId, offset, 50);
                    if(type === "album") playAlbumSongs(currentListId, offset, 50);
                }
            }
        }

        if(audio.current) {
            audio.current.addEventListener('ended', onTrackEnded)
        }

        return () => {
            if(audio.current) {
                audio.current.removeEventListener('ended', onTrackEnded)
            }
        }
    }, [repeatType, currentListId, type, currentSongIndex, nextUpSongs.length, playAlbumSongs,  setPlaying, playPlaylistSongs])

    useEffect(() => {
        if(isPlaying) {
            audio.current?.play()
        }else {
            audio.current?.pause()
        }
    }, [isPlaying, currentSelectedSong])


    

    const nextBtnDisabled = () => {
        if(repeatType !== "repeat") {
            return !nextUpSongs.length
        }
        return false
    }


    const prevBtnDisabled = () => {
        if(repeatType !== "repeat") {
            return currentSongIndex === 0
        }
        return false
    }

    const play = () => {
        if(currentSelectedSong) {
            setPlaying(!isPlaying);
        }
    }

    const setRepeatType = () => {
        if(repeatType === "") setRepeat("repeat");
        if(repeatType === "repeat") setRepeat("repeat-one");
        if(repeatType === "repeat-one") setRepeat("");
    }


    const openCloseQueue = () => {
        if(location.pathname === "/queue") {
            history.goBack()
        }else {
            history.push('/queue');
        }
    }
    return (
        <div className={`${NowPlayingStyles["now-playing-bar"]}`}>
            <div className={`${NowPlayingStyles["now-playing-bar__left"]}`}>
                {currentSelectedSong && <SongInfo artists={currentSelectedSong.artists} albumId={currentSelectedSong.album.id} img={currentSelectedSong.album.images[0].url} title={currentSelectedSong.name} />}
            </div>
            <div className={`${NowPlayingStyles["now-playing-bar__center"]}`}>
                <div className={`${NowPlayingStyles["player-controls"]}`}>
                    <div className={`${NowPlayingStyles["player-controls__buttons"]}`}>
                        <button onClick={prevTrack} disabled={prevBtnDisabled()} className={`${NowPlayingStyles["control-button"]}`}>
                            <MdSkipPrevious />
                        </button>
                        <button  onClick={play} className={`${NowPlayingStyles["control-button"]} ${NowPlayingStyles["control-button--circled"]}`}>
                            {isPlaying ?  <MdPause />: <MdPlayArrow />  } 
                        </button>
                        <button onClick={nextTrack} disabled={nextBtnDisabled()} className={`${NowPlayingStyles["control-button"]}`}>
                            <MdSkipNext />
                        </button>
                    </div>
                    <PlaybackBar audio={audio.current} />
                </div>
            </div>
            <div className={`${NowPlayingStyles["now-playing-bar__right"]}`}>
                <div className={`${NowPlayingStyles["extra-controls"]}`}>
                    <div title="Queue" onClick={openCloseQueue} className={`${location.pathname === "/queue" ? NowPlayingStyles["extra-controls-button--opened"] : NowPlayingStyles["extra-controls-button"]}`} >
                        <RiPlayListLine />
                    </div>
                    <div title={!repeatType ? "Enable repeat" : repeatType === "repeat" ? "Enable repeat-one" : "Disable repeat" } onClick={setRepeatType} className={repeatType === "" ? `${ NowPlayingStyles["extra-controls-button"]}` : `${ NowPlayingStyles["extra-controls-button"]} ${ NowPlayingStyles["extra-controls-button--opened"]}` }>
                        {repeatType === "repeat-one" ? <MdRepeatOne /> : <MdRepeat />}
                    </div>
                    <PlaybackVolume audio={audio.current} />
                </div>
            </div>
        </div>
    )
}

export default withRouter(connector(NowPlaying));
