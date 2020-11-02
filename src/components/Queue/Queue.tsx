import React, { useEffect } from 'react';
import QueueStyles from './Queue.module.css';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store/reducers';
import Track from '../Track/Track';
import { playAlbumSongs, setPlaying, playArtistSongs, playLikedSongs, playPlaylistSongs, playSearchedSongs } from '../../store/actions/music';
import {saveRemoveTracksForCurrentUser} from '../../store/actions/user';
import TrackHeader from '../Track/TrackHeader';

const mapStateToProps = (state: RootState) => ({
    currentSong: state.music.currentSelectedSong,
    nextUp: state.music.nextUpSongs,
    queueSongs: state.music.queueSongs,
    isPlaying: state.music.playing,
    currentPlayingList: state.music.currentListId,
    currentPlayingSongIndex: state.music.currentSongIndex,
    listType: state.music.type
})

const mapDispatchToProps = {
    playAlbumSongs,
    playArtistSongs,
    playLikedSongs,
    playPlaylistSongs,
    playSearchedSongs,
    setPlaying,
    saveRemoveTracksForCurrentUser
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

const Queue: React.FC<ReduxProps> = ({currentSong, nextUp, setPlaying, saveRemoveTracksForCurrentUser, listType, queueSongs, currentPlayingList, currentPlayingSongIndex, isPlaying, playAlbumSongs, playArtistSongs, playLikedSongs, playPlaylistSongs, playSearchedSongs}) => {
    
    useEffect(() => {
        console.log(listType);
    })

    const playPlaylist = () => {
        if(listType === "playlist") return playPlaylistSongs
        if(listType === "album") return playAlbumSongs
        if(listType === "artist") return playArtistSongs
        if(listType === "search") return playSearchedSongs
        if(listType === "liked") return playLikedSongs
        return playPlaylistSongs
    }
    return (
        <div className={QueueStyles.container}>
            <h1 >Queue</h1>
            {currentSong ? 
                <React.Fragment>
                    <h2 className={QueueStyles.heading}>Now Playing</h2>
                    <TrackHeader />
                    <Track
                      title={currentSong.name}
                      duration={currentSong.duration_ms} 
                      popularity={currentSong.popularity}
                      artists={currentSong.artists}
                      album={currentSong.album.name} 
                      index={0} 
                      albumId={currentSong.album.id}
                      explicit={currentSong.explicit}
                      type={listType}
                      trackId={currentSong.id}
                      uri={currentSong.uri}
                      preview_url={currentSong.preview_url}
                      isPlaying={isPlaying}
                      listId={currentPlayingList}
                      currentPlayingListId={currentPlayingList}
                      currentPlayingSongIndex={currentPlayingSongIndex}
                      playPlaylist={playPlaylist()}
                      playPause={setPlaying}
                      saveTrack={saveRemoveTracksForCurrentUser}
                      />
                      
                </React.Fragment>
            : null}
        </div>
    )
}

export default connector(Queue);
