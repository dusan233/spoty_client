import React, { useEffect, useRef } from 'react';
import NowPlayingStyles from './NowPlaying.module.css';
import {RiPlayListLine} from 'react-icons/ri';
import { RouteComponentProps, withRouter} from 'react-router-dom'
import {history} from '../../index';
import {connect, ConnectedProps} from 'react-redux';
import { RootState } from '../../store/reducers';
import { TrackSimplified } from '../../store/types';
import { setPlaying, setRepeat } from '../../store/actions/music';
import {MdSkipPrevious, MdSkipNext, MdPlayArrow, MdRepeat, MdRepeatOne, MdPause} from 'react-icons/md';
import PlaybackBar from './PlaybackBar';
import PlaybackVolume from './PlaybackVolume';

const mapStateToProps = (state: RootState) => ({
    isPlaying: state.music.playing,
    currentSelectedSong: state.music.currentSelectedSong,
    repeatType: state.music.repeatType
})
const mapDispatchToProps = {
    setPlaying,
    setRepeat
}

const connector = connect(mapStateToProps, mapDispatchToProps);



type Props = RouteComponentProps & ConnectedProps<typeof connector>;

const NowPlaying: React.FC<Props> = ({location, currentSelectedSong, repeatType, isPlaying, setRepeat,  setPlaying}) => {

    const audio = useRef<HTMLAudioElement>();

    useEffect(() => {
        console.log('dadadaad')
        if(!audio.current) audio.current = new Audio();

        if(currentSelectedSong && currentSelectedSong.preview_url !== null) {
            console.log('dadadaad')
            audio.current.src = ((currentSelectedSong as TrackSimplified).preview_url) as string;
            setPlaying(true);
            audio.current.addEventListener('ended', onTrackEnded)
        }
        
        
        

        // return () => {
        //     audio.current?.removeEventListener("ended", onTrackEnded)
        // }
    }, [currentSelectedSong, setPlaying])

    useEffect(() => {
        if(isPlaying) {
            audio.current?.play()
        }else {
            audio.current?.pause()
        }
    }, [isPlaying, currentSelectedSong])


    const onTrackEnded = (e: Event) => {
        console.log("track ended", e)
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
                <span>
                    dsa
                </span>
            </div>
            <div className={`${NowPlayingStyles["now-playing-bar__center"]}`}>
                <div className={`${NowPlayingStyles["player-controls"]}`}>
                    <div className={`${NowPlayingStyles["player-controls__buttons"]}`}>
                        <button className={`${NowPlayingStyles["control-button"]}`}>
                            <MdSkipPrevious />
                        </button>
                        <button onClick={play} className={`${NowPlayingStyles["control-button"]} ${NowPlayingStyles["control-button--circled"]}`}>
                            {isPlaying ?  <MdPause />: <MdPlayArrow />  } 
                        </button>
                        <button className={`${NowPlayingStyles["control-button"]}`}>
                            <MdSkipNext />
                        </button>
                    </div>
                    <PlaybackBar audio={audio.current} />
                </div>
            </div>
            <div className={`${NowPlayingStyles["now-playing-bar__right"]}`}>
                <div className={`${NowPlayingStyles["extra-controls"]}`}>
                    <div onClick={openCloseQueue} className={`${location.pathname === "/queue" ? NowPlayingStyles["extra-controls-button--opened"] : NowPlayingStyles["extra-controls-button"]}`} >
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
