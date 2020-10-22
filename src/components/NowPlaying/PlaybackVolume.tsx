import React from 'react';
import NowPlayingStyles from './NowPlaying.module.css';
import {MdVolumeUp} from 'react-icons/md';
import {batch, connect, ConnectedProps} from 'react-redux';
import { RootState } from '../../store/reducers';
import { setTime, setProgressValues } from '../../store/actions/music';

const mapStateToProps = (state: RootState) => ({
    currentTime: state.music.currentTime,
    durationTime: state.music.durationTime,
    sliderPercent: state.music.sliderPercent,
    progressBarPercent: state.music.progressBarPercent
})
const mapDispatchToProps = {
    setTime,
    setProgressValues
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>


type Props = {
    audio: HTMLAudioElement | undefined
} & ReduxProps


const PlaybackVolume: React.FC<Props> = () => {
    return (
        <div className={`${NowPlayingStyles["volume-bar"]}`}>
            <button className={`${NowPlayingStyles["volume-bar__icon"]}`}>
                <MdVolumeUp />
            </button>
            <div   className={`${NowPlayingStyles["progress-bar"]}`}>
                <div className={`${NowPlayingStyles["progress-bar__bg"]}`}>
                    <div style={{transform: `translateX(-80%)`}} className={`${NowPlayingStyles["progress-bar__fg"]}`}></div>
                    
                </div>
                <button style={{left: "20%"}} className={`${NowPlayingStyles["progress-bar__slider"]}`}></button>
            </div>
        </div>
    )
}

export default connector(PlaybackVolume)
