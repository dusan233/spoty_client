import React from 'react';
import NowPlayingStyles from './NowPlaying.module.css';
import {RiPlayListLine} from 'react-icons/ri';
import { RouteComponentProps, withRouter} from 'react-router-dom'
import {history} from '../../index';



type Props = RouteComponentProps;

const NowPlaying: React.FC<Props> = ({location}) => {
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
                <span>dsa</span>
            </div>
            <div className={`${NowPlayingStyles["now-playing-bar__right"]}`}>
                <div className={`${NowPlayingStyles["extra-controls"]}`}>
                    <div onClick={openCloseQueue} className={`${location.pathname === "/queue" ? NowPlayingStyles["show-queue-btn-opened"] : NowPlayingStyles["show-queue-btn"]}`} >
                        <RiPlayListLine />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(NowPlaying);
