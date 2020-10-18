import React, { useEffect, useRef, useState } from "react";
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";
import { connect, ConnectedProps } from "react-redux";
import {
  getPlaylistData,
  setPlaylistLoading,
  addMoreTracks,
  getMoreTracks,
  removeTracksFromPlaylist,
} from "../../store/actions/playlist";
import { playPlaylistSongs } from '../../store/actions/music';
import {
  saveRemoveTracksForCurrentUser,
  saveRemovePlaylistForCurrentUser,
} from "../../store/actions/user";
import { setError } from "../../store/actions/error";
import { RouteComponentProps } from "react-router-dom";
import { RootState } from "../../store/reducers/index";

import { BsMusicNoteBeamed } from "react-icons/bs";
import { Link } from "react-router-dom";
import PlaylistStyles from "./Playlist.module.css";
import Spinner from "../Spinner/Spinner";
import PlaylistHeader from "../PlaylistHeader/PlaylistHeader";
import Track from "../Track/Track";
import TrackHeader from "../Track/TrackHeader";
import StickyHeader from "../StickyHeader/StickyHeader";

const mapStateToProps = (state: RootState) => ({
  loading: state.playlist.loading,
  name: state.playlist.name,
  owner: state.playlist.owner,
  followers: state.playlist.followers,
  img: state.playlist.img,
  description: state.playlist.description,
  tracks: state.playlist.tracks,
  accessToken: state.auth.accessToken,
  total: state.playlist.total,
  type: state.playlist.type,
  error: state.error.errorMsg,
  subErrorMsg: state.error.subMsg,
  tracksLikes: state.user.trackLikes,
  playlistLikes: state.user.playlistLikes,
  userId: state.user.userId,
  ownerId: state.playlist.ownerId,
});
const mapDispatchToProps = {
  getPlaylistData,
  setPlaylistLoading,
  addMoreTracks,
  setError,
  saveRemoveTracksForCurrentUser,
  saveRemovePlaylistForCurrentUser,
  removeTracksFromPlaylist,
  playPlaylistSongs
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type Params = {
  playlistId?: string;
};
type Props = ReduxProps & RouteComponentProps<Params>;

const Playlist: React.FC<Props> = ({
  getPlaylistData,
  setPlaylistLoading,
  addMoreTracks,
  setError,
  saveRemoveTracksForCurrentUser,
  saveRemovePlaylistForCurrentUser,
  removeTracksFromPlaylist,
  playPlaylistSongs,
  match,
  loading,
  name,
  description,
  img,
  owner,
  followers,
  tracks,
  accessToken,
  total,
  error,
  subErrorMsg,
  tracksLikes,
  playlistLikes,
  userId,
  ownerId,
}) => {
  const [showSticky, setShowSticky] = useState(false);
  let containerEl = useRef<HTMLDivElement>(null);
  let itemsCount = total === tracks.length ? tracks.length : tracks.length + 1;

  useEffect(() => {
    getPlaylistData(match.params.playlistId);

    return () => {
      setPlaylistLoading(true);
      setError("", "");
    };
  }, [getPlaylistData, match.params.playlistId, setPlaylistLoading, setError]);

  useEffect(() => {
    let refEl = containerEl.current;
    if (refEl) {
      refEl!.addEventListener("scroll", function () {
        if (this.scrollTop >= 150) {
          setShowSticky(true);
        } else {
          setShowSticky(false);
        }
      });
    }
    return () => {
      if (refEl) {
        refEl!.removeEventListener("scroll", function () {
          if (this.scrollTop >= 150) {
            setShowSticky(true);
          } else {
            setShowSticky(false);
          }
        });
      }
    };
  }, []);

  const playPlaylist = () => {
    if(match.params.playlistId) {
      playPlaylistSongs(match.params.playlistId);
    }
  }

  const loadMoreTracks = ({ startIndex }: { startIndex: number }) => {
    return getMoreTracks(startIndex, match.params.playlistId, accessToken)
      .then((response) => {
        const tracks = response.data.items;
        addMoreTracks(tracks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!tracks[index];
  };

  const renderRow = ({ key, index, style }: any) => {
    const track = tracks[index];
    const liked = tracksLikes[index];
    if (!tracks[index]) {
      return (
        <div style={{ ...style }} key={key} className="loader-container">
          <Spinner />
        </div>
      );
    } else {
      return (
        <Track
          type="playlist"
          index={index}
          key={track.track.id + index}
          style={style}
          title={track.track.name}
          artists={track.track.artists}
          album={track.track.album.name}
          duration={track.track.duration_ms}
          explicit={track.track.explicit}
          popularity={track.track.popularity}
          albumId={track.track.album.id}
          liked={liked}
          playlistId={match.params.playlistId}
          userId={userId}
          playlistOwnerId={ownerId}
          uri={track.track.uri}
          trackId={track.track.id}
          saveTrack={saveRemoveTracksForCurrentUser}
          remvoeTrackFromPlaylist={removeTracksFromPlaylist}
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
    <div ref={containerEl} className={PlaylistStyles.container}>
      {loading ? (
        <div className="loader-container">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <PlaylistHeader
            ownerId={ownerId}
            userId={userId}
            liked={playlistLikes[0]}
            playlistId={match.params.playlistId}
            savePlaylist={saveRemovePlaylistForCurrentUser}
            name={name}
            followers={followers}
            owner={owner}
            description={description}
            img={img}
            totalSongs={total}
            type="Playlist"
            playPlaylist={playPlaylist}
          />
          {!tracks.length ? (
            <div className="error-container--small">
              <div>
                <div className="error-icon">
                  <BsMusicNoteBeamed />
                </div>
                <h1 className="error-heading">It's a bit empty here...</h1>
                <h3 className="error-text margin-bottom">
                  Let's find some songs for your playlist
                </h3>
                <Link className="btn btn--circle btn--white " to="/">
                  NEW RELEASES
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: "30px" }}>
              <TrackHeader />
              {showSticky && (
                <StickyHeader
                  savePlaylist={saveRemovePlaylistForCurrentUser}
                  totalSongs={total}
                  ownerId={ownerId}
                  userId={userId}
                  liked={playlistLikes[0]}
                  playlistId={match.params.playlistId}
                  followers={followers}
                  description={description}
                  img={img}
                  title={name}
                  owner={owner}
                />
              )}
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
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default connector(Playlist);
