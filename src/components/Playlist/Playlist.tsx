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
} from "../../store/actions/playlist";
import { RouteComponentProps } from "react-router-dom";
import { RootState } from "../../store/reducers/index";

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
});
const mapDispatchToProps = {
  getPlaylistData,
  setPlaylistLoading,
  addMoreTracks,
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
}) => {
  const [showSticky, setShowSticky] = useState(false);
  let containerEl = useRef<HTMLDivElement>(null);
  let itemsCount = total === tracks.length ? tracks.length : tracks.length + 1;
  useEffect(() => {
    getPlaylistData(match.params.playlistId);

    return () => {
      setPlaylistLoading(true);
    };
  }, [getPlaylistData, match.params.playlistId]);

  useEffect(() => {
    containerEl.current!.addEventListener("scroll", function () {
      if (this.scrollTop >= 150) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    });
    return () => {
      containerEl.current!.removeEventListener("scroll", function () {
        if (this.scrollTop >= 150) {
          setShowSticky(true);
        } else {
          setShowSticky(false);
        }
      });
    };
  }, []);

  const loadMoreTracks = ({ startIndex }: { startIndex: number }) => {
    return getMoreTracks(startIndex, match.params.playlistId, accessToken).then(
      (response) => {
        const tracks = response.data.items;
        addMoreTracks(tracks);
      }
    );
  };

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!tracks[index];
  };

  const renderRow = ({ key, index, style }: any) => {
    const track = tracks[index];
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
          key={track.track.id}
          style={style}
          title={track.track.name}
          artists={track.track.artists}
          album={track.track.album.name}
          duration={track.track.duration_ms}
          explicit={track.track.explicit}
          popularity={track.track.popularity}
        />
      );
    }
  };
  return (
    <div ref={containerEl} className={PlaylistStyles.container}>
      {loading ? (
        <div className="loader-container">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <PlaylistHeader
            name={name}
            followers={followers}
            owner={owner}
            description={description}
            img={img}
            totalSongs={total}
            type="Playlist"
          />

          <div style={{ padding: "30px" }}>
            <TrackHeader />
            {showSticky && (
              <StickyHeader
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
        </React.Fragment>
      )}
    </div>
  );
};

export default connector(Playlist);
