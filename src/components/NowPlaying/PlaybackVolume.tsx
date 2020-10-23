import React, { useEffect, useRef, useState } from 'react';
import NowPlayingStyles from './NowPlaying.module.css';
import {MdVolumeUp, MdVolumeOff} from 'react-icons/md';
import { batch, connect, ConnectedProps} from 'react-redux';
import { RootState } from '../../store/reducers';
import { setVolume, setMute } from '../../store/actions/music';

const mapStateToProps = (state: RootState) => ({
    volume: state.music.volume,
    muted: state.music.muted
})
const mapDispatchToProps = {
    setVolume,
    setMute
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>


type Props = {
    audio: HTMLAudioElement | undefined
} & ReduxProps


const PlaybackVolume: React.FC<Props> = ({setVolume, setMute, volume, audio, muted}) => {
    const [mouseDown, setMouseDown] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(audio) {
            audio.volume = volume;
        }
    }, [volume, audio])

    useEffect(() => {
        if(audio) {
            audio.muted = muted
        }
    }, [muted, audio]);

    const onMuteSound = () => {
        setMute(!muted);
    }

    const onMouseDownSlider = (event: React.MouseEvent<HTMLDivElement>) => {
        const elementXOffset = event.currentTarget.getBoundingClientRect().left;
        const sliderPercent = (100 * (event.pageX - elementXOffset)) / event.currentTarget.clientWidth;
        let volume = sliderPercent / 100;
        if(sliderPercent < 0) {
            volume = 0;
        }
        if(sliderPercent > 100) {
            volume = 1
        }
        setMouseDown(true);
        
        batch(() => {
            setVolume(volume);
            if(volume > 0) {
                setMute(false)
        }else {
            setMute(true)
        }
        })
    }

    const onMouseUpSlider = (event: React.MouseEvent<HTMLDivElement>) => {
        setMouseDown(false);
    }

    const onMouseMoveSlider = (event: React.MouseEvent<HTMLDivElement>) => {
        if(mouseDown) {
            const elementXOffset = event.currentTarget.getBoundingClientRect().left;
            const sliderPercent = (100 * (event.pageX - elementXOffset)) / event.currentTarget.clientWidth;
          
            const volume = sliderPercent / 100;
            if(sliderPercent >= 0 && sliderPercent <= 100) {
                batch(() => {
                    setVolume(volume);
                    if(volume <= 0.0002976190476190476) {
                        setMute(true)
                    }else {
                        setMute(false)
                    }
                })
            }
        }
    }


    return (
        <div className={`${NowPlayingStyles["volume-bar"]}`}>
            <button onClick={onMuteSound} className={`${NowPlayingStyles["volume-bar__icon"]}`}>
               {muted ? <MdVolumeOff /> : <MdVolumeUp /> } 
            </button>
            <div ref={progressBarRef} onMouseUp={onMouseUpSlider} onMouseMove={onMouseMoveSlider} onMouseDown={onMouseDownSlider}   className={`${NowPlayingStyles["progress-bar"]}`}>
                <div className={`${NowPlayingStyles["progress-bar__bg"]}`}>
                    <div style={{transform: `translateX(-${ 100 - (volume * 100)}%)`}} className={`${NowPlayingStyles["progress-bar__fg"]}`}></div>
                </div>
                <button style={{left:`${volume * 100}%`}} className={`${mouseDown ? NowPlayingStyles["progress-bar__slider--show"] : NowPlayingStyles["progress-bar__slider"]}`}></button>
            </div>
        </div>
    )
}

export default connector(PlaybackVolume)
