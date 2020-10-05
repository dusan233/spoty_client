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
import {
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
} from "../../store/actions/user";
import { setError } from "../../store/actions/error";
import { RouteComponentProps } from "react-router-dom";
import { RootState } from "../../store/reducers/index";

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
});

const mapDispatchToProps = {
  getAlbumData,
  setAlbumLoading,
  addMoreAlbumTracks,
  setError,
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
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
  trackLikes,
  albumLikes,
  loading,
  artists,
  name,
  date,
  img,
  total,
  type,
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
  }, [getAlbumData, match.params.albumId, setAlbumLoading]);

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
          key={track.id}
          style={style}
          title={track.name}
          artists={track.artists}
          duration={track.duration_ms}
          explicit={track.explicit}
          uri={track.uri}
          hidePopularity={true}
          trackId={track.id}
          index={index}
          liked={liked}
          saveTrack={saveRemoveTracksForCurrentUser}
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
            albumId={match.params.albumId}
            liked={albumLikes[0]}
            name={name}
            artists={artists}
            img={img}
            totalSongs={total}
            type={type}
            dateAdded={date}
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
                    key={track.id}
                    title={track.name}
                    artists={track.artists}
                    duration={track.duration_ms}
                    uri={track.uri}
                    explicit={track.explicit}
                    hidePopularity={true}
                    trackId={track.id}
                    liked={liked}
                    saveTrack={saveRemoveTracksForCurrentUser}
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
