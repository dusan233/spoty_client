import React, { useEffect, useRef, useState } from 'react';
import QueueStyles from './Queue.module.css';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store/reducers';
import Track from '../Track/Track';
import { playAlbumSongs, setPlaying, playArtistSongs, playLikedSongs, playPlaylistSongs, playSearchedSongs } from '../../store/actions/music';
import {saveRemoveTracksForCurrentUser, checkCurrentUserSavedTracks, setTrackLikes} from '../../store/actions/user';
import TrackHeader from '../Track/TrackHeader';
import InfiniteVirtualizedList from '../InfiniteVirtualizedList/InfiniteVirtualizedList';
import Spinner from '../Spinner/Spinner';
import { TrackFull } from '../../store/types';

const mapStateToProps = (state: RootState) => ({
    accessToken: state.auth.accessToken,
    currentSong: state.music.currentSelectedSong,
    nextUp: state.music.nextUpSongs,
    queueSongs: state.music.queueSongs,
    isPlaying: state.music.playing,
    currentPlayingList: state.music.currentListId,
    currentPlayingSongIndex: state.music.currentSongIndex,
    listType: state.music.type,
    trackLikes: state.user.trackLikes
})

const mapDispatchToProps = {
    playAlbumSongs,
    playArtistSongs,
    playLikedSongs,
    playPlaylistSongs,
    playSearchedSongs,
    setPlaying,
    saveRemoveTracksForCurrentUser,
    setTrackLikes
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

const Queue: React.FC<ReduxProps> = ({currentSong, nextUp, trackLikes, accessToken, setPlaying, setTrackLikes, saveRemoveTracksForCurrentUser, listType, queueSongs, currentPlayingList, currentPlayingSongIndex, isPlaying, playAlbumSongs, playArtistSongs, playLikedSongs, playPlaylistSongs, playSearchedSongs}) => {
    let containerEl = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTrackLikes = async () => {
        if(currentSong) {
            if(nextUp.length) {
                let checkCurrentSongLike = await checkCurrentUserSavedTracks(currentSong!.id, accessToken);
                let checkNextupSongsLikes = await checkCurrentUserSavedTracks(nextUp.map(track => track.id).join(","), accessToken);
                setLoading(false)
                setTrackLikes([...checkCurrentSongLike.data, ...checkNextupSongsLikes.data])
            }else {
                let checkCurrentSongLike = await checkCurrentUserSavedTracks(currentSong!.id, accessToken);
                setLoading(false)
                setTrackLikes([...checkCurrentSongLike.data])
            }
            
        }
        
       
        
      }

      getTrackLikes();
        
        
    }, [currentSong, accessToken, nextUp, setTrackLikes])

    const playPlaylist = () => {
        if(listType === "playlist") return playPlaylistSongs
        if(listType === "album") return playAlbumSongs
        if(listType === "artist") return playArtistSongs
        if(listType === "search") return playSearchedSongs
        if(listType === "liked") return playLikedSongs
        return playPlaylistSongs
    }
    return (
        <div ref={containerEl} className={QueueStyles.container}>
           {!loading && currentSong ? 
           <div style={{width: "100%"}}>
            <h1 >Queue</h1>
           
                
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
                      type="queue"
                      selectedSong={true}
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
                      liked={trackLikes[0]}
                      />
                      {nextUp.length ? <React.Fragment>
                        <h2 className={QueueStyles.heading}>Next Up</h2>
                      <TrackHeader />
                      <InfiniteVirtualizedList
                        items={nextUp}
                        totalItems={nextUp.length}
                        rowHeight={44}
                        containerEl={containerEl}
                        type="playlist"
                        loadMoreItems={(_: any) => Promise.resolve()}
                        renderRow={({ key, index, style }: any) => {
                            const item = nextUp[index];
                            let track = item as TrackFull;
                            const liked = trackLikes[index + 1];
                            if (!nextUp[index]) {
                              return (
                                <div
                                  style={{ ...style }}
                                  key={key}
                                  className="loader-container"
                                >
                                  <Spinner />
                                </div>
                              );
                            } else {
                              return (
                                <Track
                                  title={track.name}
                                  artists={track.artists}
                                  duration={track.duration_ms}
                                  explicit={track.explicit}
                                  type="queue"
                                  listId={currentPlayingList}
                                  popularity={track.popularity}
                                  album={track.album.name}
                                  style={style}
                                  key={track.id + index}
                                  uri={track.uri}
                                  trackId={track.id}
                                  index={index}
                                  isPlaying={isPlaying}
                                  preview_url={track.preview_url}
                                  currentPlayingListId={currentPlayingList}
                                  currentPlayingSongIndex={currentPlayingSongIndex}
                                  saveTrack={saveRemoveTracksForCurrentUser}
                                  playPause={setPlaying}
                                  playPlaylist={playPlaylist()}
                                  liked={liked}
                                  albumId={track.album.id}
                                />
                              );
                            }
                          }}
                      />
                        </React.Fragment>: null}
                </div>
            : <Spinner />}
        </div>
    )
}

export default connector(Queue);
