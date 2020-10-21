import React, {  useEffect, useRef, useState} from 'react';
import NowPlayingStyles from './NowPlaying.module.css';
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
const PlaybackBar: React.FC<Props> = ({audio, currentTime, durationTime, progressBarPercent, sliderPercent,setProgressValues, setTime}) => {
    const [mouseDown, setMouseDown] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);


    

    useEffect(() => {
        const onTimeUpdate = (e: Event) => {
            if(!mouseDown) {
                const {duration, currentTime} = (e.composedPath()[0] as HTMLAudioElement);
        
                const sliderPercent = (currentTime/duration) * 100;
                const progressBarPercent = - (100 - sliderPercent);
        
                const durationMinutes = Math.floor(duration / 60);
                let durationSeconds: string | number = Math.floor(duration - durationMinutes * 60);
                if(durationSeconds < 10) {
                    durationSeconds = `0${durationSeconds}`
                }
                const currentMinutes = Math.floor(currentTime / 60);
                let currentSeconds: string | number = Math.floor(currentTime - currentMinutes * 60);
                if(currentSeconds < 10) {
                    currentSeconds = `0${currentSeconds}`
                }
                
                batch(() => {
                    setTime(`${durationMinutes}:${durationSeconds}`, `${currentMinutes}:${currentSeconds}`);
                    setProgressValues(sliderPercent, progressBarPercent);
                })
            }
        }

        if(audio) {
            audio.addEventListener('timeupdate', onTimeUpdate )
        }

        return (() => {
            if(audio) {
                audio.removeEventListener("timeupdate", onTimeUpdate);
            }
        })
    }, [audio, setTime, setProgressValues, mouseDown])

    
   


    const onMouseDownSlider = (event: React.MouseEvent<HTMLDivElement>) => {
        const elementXOffset = event.currentTarget.getBoundingClientRect().left;
        const sliderPercent = (100 * (event.pageX - elementXOffset)) / event.currentTarget.clientWidth;
        const progressBarPercent = - (100 - sliderPercent);

        let currentTime;

        if(audio) {
            currentTime = (sliderPercent / 100) * audio.duration

            const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds: string | number = Math.floor(currentTime - currentMinutes * 60);
        if(currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`
        }

        setMouseDown(true);
        batch(() => {
            setTime(durationTime, `${currentMinutes}:${currentSeconds}`)
            setProgressValues(sliderPercent, progressBarPercent);
        })
        }
      
        
    }

    const onMouseUpSlider = (event: React.MouseEvent<HTMLDivElement>) => {
        const elementXOffset = event.currentTarget.getBoundingClientRect().left;
        const sliderPercent = (100 * (event.pageX - elementXOffset)) / event.currentTarget.clientWidth;
       
        if(audio) {
            const currentTimeSeconds = (sliderPercent / 100) * audio.duration;
            audio.currentTime = currentTimeSeconds;
        }
        setMouseDown(false);
    }

    const onMouseMoveSlider = (event: React.MouseEvent<HTMLDivElement>) => {
        if(mouseDown) {
            const elementXOffset = event.currentTarget.getBoundingClientRect().left;
            const sliderPercent = (100 * (event.pageX - elementXOffset)) / event.currentTarget.clientWidth;
            const progressBarPercent = - (100 - sliderPercent);

            const durationSeconds = parseInt(durationTime.split(":")[0]) * 60 + parseInt(durationTime.split(":")[1])
           
            const currentTime = (sliderPercent / 100) * durationSeconds;
          
            const currentMinutes = Math.floor(currentTime / 60);
            let currentSeconds: string | number = Math.floor(currentTime - currentMinutes * 60);
            if(currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`
            }

            batch(() => {
                setTime(durationTime, `${currentMinutes}:${currentSeconds}`);
                setProgressValues(sliderPercent, progressBarPercent);
            })
        }
    }

    return (
        <div className={`${NowPlayingStyles["playback-bar"]}`}>
            <div className={`${NowPlayingStyles["playback-bar__progress-time"]}`}>{currentTime}</div>
            <div ref={progressBarRef} onMouseUp={onMouseUpSlider} onMouseDown={onMouseDownSlider} onMouseMove={onMouseMoveSlider} className={`${NowPlayingStyles["progress-bar"]}`}>
                <div className={`${NowPlayingStyles["progress-bar__bg"]}`}>
                    <div style={{transform: `translateX(${progressBarPercent}%)`}} className={`${NowPlayingStyles["progress-bar__fg"]}`}></div>
                    
                </div>
                <button style={{left: `${sliderPercent}%`}} className={`${NowPlayingStyles["progress-bar__slider"]}`}></button>
            </div>
            <div className={`${NowPlayingStyles["playback-bar__progress-time"]}`}>{durationTime}</div>
        </div>
    )
}

export default connector(PlaybackBar);
