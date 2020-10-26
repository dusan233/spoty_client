import React, { useEffect, useRef } from "react";
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";
import { connect, ConnectedProps } from "react-redux";
import {
  getAlbumData,
  setAlbumLoading,
  addMoreAlbumTracks,
  getMoreAlbumTracks,
} from "../../store/actions/album";
import { addTracksToPlaylist } from "../../store/actions/playlist";
import {
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
} from "../../store/actions/user";
import { setError } from "../../store/actions/error";
import { RouteComponentProps } from "react-router-dom";
import { RootState } from "../../store/reducers/index";
import { playAlbumSongs, setPlaying } from '../../store/actions/music';

import { BsMusicNoteBeamed } from "react-icons/bs";
import AlbumStyles from "./Album.module.css";
import Spinner from "../Spinner/Spinner";
import AlbumHeader from "../PlaylistHeader/AlbumHeader";
import Track from "../Track/Track";
import TrackHeader from "../Track/TrackHeader";

const mapStateToProps = (state: RootState) => ({
  accessToken: state.auth.accessToken,
  loading: state.album.loading,
  type: state.album.type,
  total: state.album.total,
  img: state.album.img,
  name: state.album.name,
  date: state.album.date,
  artists: state.album.owner,
  tracks: state.album.tracks,
  error: state.error.errorMsg,
  subErrorMsg: state.error.subMsg,
  trackLikes: state.user.trackLikes,
  albumLikes: state.user.albumLikes,
  isPlaying: state.music.playing,
  currentPlayingList: state.music.currentListId,
  currentPlayingSongIndex: state.music.currentSongIndex
});

const mapDispatchToProps = {
  getAlbumData,
  setAlbumLoading,
  addMoreAlbumTracks,
  setError,
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
  addTracksToPlaylist,
  setPlaying,
  playAlbumSongs
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type Params = {
  albumId?: string;
};
type Props = ReduxProps & RouteComponentProps<Params>;

const Album: React.FC<Props> = ({
  match,
  accessToken,
  getAlbumData,
  setAlbumLoading,
  setError,
  addMoreAlbumTracks,
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
  addTracksToPlaylist,
  setPlaying,
  playAlbumSongs,
  trackLikes,
  albumLikes,
  loading,
  artists,
  name,
  date,
  img,
  total,
  type,
  isPlaying,
  currentPlayingList,
  currentPlayingSongIndex,
  tracks,
  error,
  subErrorMsg,
}) => {
  let containerEl = useRef<HTMLDivElement>(null);
  let itemsCount = total === tracks.length ? tracks.length : tracks.length + 1;

  useEffect(() => {
    getAlbumData(match.params.albumId);

    return () => {
      setAlbumLoading(true);
      setError("", "");
    };
  }, [getAlbumData, match.params.albumId, setAlbumLoading, setError]);

  const trackUris = () => {
    let uris = "";
    tracks.forEach((track) => {
      if (!uris) {
        uris += track.uri;
      } else {
        uris += "," + track.uri;
      }
    });
    return uris;
  };


  const playAlbum = () => {
    if(match.params.albumId) {
      playAlbumSongs(match.params.albumId, 0, 50);
    }
  }

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!tracks[index];
  };

  const loadMoreTracks = ({ startIndex }: { startIndex: number }) => {
    return getMoreAlbumTracks(startIndex, match.params.albumId, accessToken)
      .then((response) => {
        const tracks = response.data.items;
        addMoreAlbumTracks(tracks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderRow = ({ key, index, style }: any) => {
    const track = tracks[index];
    const liked = trackLikes[index];
    if (!tracks[index]) {
      return (
        <div style={{ ...style }} key={key} className="loader-container">
          <Spinner />
        </div>
      );
    } else {
      return (
        <Track
          type="album"
          key={track.id + index}
          style={style}
          title={track.name}
          artists={track.artists}
          duration={track.duration_ms}
          albumId={match.params.albumId}
          explicit={track.explicit}
          preview_url={track.preview_url}
          uri={track.uri}
          hidePopularity={true}
          currentPlayingSongIndex={currentPlayingSongIndex}
          isPlaying={isPlaying}
          currentPlayingListId={currentPlayingList}
          trackId={track.id}
          index={index}
          liked={liked}
          saveTrack={saveRemoveTracksForCurrentUser}
          playPause={setPlaying}
          playPlaylist={playAlbumSongs}
        />
      );
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div>
          <div className="error-icon">
            <BsMusicNoteBeamed />
          </div>
          <h1 className="error-heading">{error}</h1>
          <h3 className="error-text">{subErrorMsg}</h3>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerEl} className={AlbumStyles.container}>
      {loading ? (
        <div className="loader-container">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <AlbumHeader
            trackUris={trackUris()}
            totalTracks={total}
            albumId={match.params.albumId}
            liked={albumLikes[0]}
            name={name}
            artists={artists}
            img={img}
            totalSongs={total}
            type={type}
            dateAdded={date}
            currentPlayingList={currentPlayingList}
            isPlaying={isPlaying}
            playPause={setPlaying}
            playAlbum={playAlbum}
            saveAlbum={saveRemoveAlbumsForCurrentUser}
          />
          <div style={{ padding: "30px" }}>
            <TrackHeader type="album" hidePopularity={true} />
            {type === "single" ? (
              tracks.map((track, index) => {
                const liked = trackLikes[index];
                return (
                  <Track
                    type="album"
                    index={index}
                    key={track.id + index}
                    title={track.name}
                    albumId={match.params.albumId}
                    preview_url={track.preview_url}
                    currentPlayingSongIndex={currentPlayingSongIndex}
                    artists={track.artists}
                    duration={track.duration_ms}
                    uri={track.uri}
                    explicit={track.explicit}
                    hidePopularity={true}
                    trackId={track.id}
                    isPlaying={isPlaying}
                    currentPlayingListId={currentPlayingList}
                    liked={liked}
                    saveTrack={saveRemoveTracksForCurrentUser}
                    playPause={setPlaying}
                    playPlaylist={playAlbumSongs}
                  />
                );
              })
            ) : (
              <WindowScroller scrollElement={containerEl.current}>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={loadMoreTracks}
                        rowCount={itemsCount}
                      >
                        {({ onRowsRendered, registerChild }) => (
                          <List
                            autoHeight
                            className="List"
                            height={height}
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                            isScrolling={isScrolling}
                            onScroll={onChildScroll}
                            scrollTop={scrollTop}
                            rowHeight={44}
                            rowCount={itemsCount}
                            rowRenderer={renderRow}
                            width={width}
                          />
                        )}
                      </InfiniteLoader>
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default connector(Album);
