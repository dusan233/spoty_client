import React, { useEffect, useRef } from "react";
import LibraryStyles from "./MusicLibrary.module.css";
import { RouteComponentProps } from "react-router-dom";
import { ConnectedProps, connect, batch } from "react-redux";
import { RootState } from "../../store/reducers/index";
import {
  getUsersAlbums,
  getUserTracks,
  setLibraryLoading,
  fetchUserTracks,
  fetchUserAlbums,
  setLibraryTracks,
  setLibraryAlbums,
} from "../../store/actions/library";
import {
  saveRemoveAlbumsForCurrentUser,
  saveRemoveTracksForCurrentUser,
  setTrackLikes,
  setAlbumLikes,
  checkCurrentUserSavedTracks,
  checkCurrentUserSavedAlbums,
} from "../../store/actions/user";
import { AlbumFull, SavedAlbum } from "../../store/types/album";

import Spinner from "../Spinner/Spinner";
import InfiniteVirtualizedList from "../InfiniteVirtualizedList/InfiniteVirtualizedList";
import SearchPlaylistCard from "../Card/SearchPlaylist";
import Track from "../Track/Track";
import TrackHeader from "../Track/TrackHeader";
import { SavedTrack } from "../../store/types";

const mapStateToProps = (state: RootState) => ({
  loading: state.library.loading,
  albums: state.library.albums,
  albumsTotal: state.library.albumsTotal,
  albumLikes: state.user.albumLikes,
  tracks: state.library.tracks,
  tracksTotal: state.library.tracksTotal,
  trackLikes: state.user.trackLikes,
  accessToken: state.auth.accessToken,
});

const mapDispatchToProps = {
  getUsersAlbums,
  getUserTracks,
  setTrackLikes,
  setAlbumLikes,
  setLibraryLoading,
  setLibraryTracks,
  setLibraryAlbums,
  saveRemoveAlbumsForCurrentUser,
  saveRemoveTracksForCurrentUser,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Params = {
  term: string;
};

type Props = RouteComponentProps<Params> & ReduxProps;

const MusicLibrary: React.FC<Props> = ({
  match,
  getUsersAlbums,
  getUserTracks,
  setLibraryLoading,
  setTrackLikes,
  setLibraryTracks,
  setLibraryAlbums,
  setAlbumLikes,
  saveRemoveAlbumsForCurrentUser,
  saveRemoveTracksForCurrentUser,
  loading,
  albums,
  albumLikes,
  albumsTotal,
  tracks,
  trackLikes,
  tracksTotal,
  accessToken,
}) => {
  let containerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (match.params.term === "albums") {
      getUsersAlbums(true);
    }
    if (match.params.term === "tracks") {
      console.log("dssdsadas");
      getUserTracks(true);
    }
    return () => {
      setLibraryLoading(true);
    };
  }, [match.params.term, getUsersAlbums, getUserTracks]);

  const loadMoreTracks = ({ startIndex }: { startIndex: number }) => {
    return fetchUserTracks(tracks.length, accessToken)
      .then((res) => {
        let trackIds = "";

        res.data.items.slice(0, 50).forEach((track) => {
          if (trackIds === " ") {
            trackIds += track.track.id;
          } else {
            trackIds += "," + track.track.id;
          }
        });

        return checkCurrentUserSavedTracks(trackIds, accessToken).then(
          (savedTracksRes) => {
            batch(() => {
              setLibraryTracks(res.data.items, res.data.total, "add");
              setTrackLikes([...savedTracksRes.data], "add");
            });
          }
        );
      })
      .catch((err) => console.log(err));
  };

  const loadMoreAlbums = ({ startIndex }: { startIndex: number }) => {
    return fetchUserAlbums(albums.length, accessToken).then((res) => {
      let albumIds = "";

      res.data.items.slice(0, 50).forEach((album) => {
        if (albumIds === " ") {
          albumIds += album.album.id;
        } else {
          albumIds += "," + album.album.id;
        }
      });

      return checkCurrentUserSavedAlbums(albumIds, accessToken).then(
        (savedAlbumsRes) => {
          batch(() => {
            setLibraryAlbums(res.data.items, res.data.total, "add");
            setAlbumLikes([...savedAlbumsRes.data], "add");
          });
        }
      );
    });
  };

  //   useEffect(() => {
  //     console.log("library");
  //   });

  const renderList = () => {
    if (match.params.term === "albums") {
      return (
        <InfiniteVirtualizedList
          items={albums}
          totalItems={albumsTotal}
          rowHeight={85}
          containerEl={containerEl}
          type="albums"
          loadMoreItems={loadMoreAlbums}
          renderRow={({ key, index, style }: any) => {
            const item = albums[index];
            let savedAlbum = item as SavedAlbum;
            const liked = albumLikes[index];
            if (!albums[index]) {
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
                <SearchPlaylistCard
                  img={
                    savedAlbum.album.images[0] && savedAlbum.album.images[0].url
                  }
                  description={(savedAlbum.album as AlbumFull).artists[0].name}
                  name={savedAlbum.album.name}
                  itemId={savedAlbum.album.id}
                  index={index}
                  style={style}
                  userId={(savedAlbum.album as AlbumFull).artists[0].id}
                  key={savedAlbum.album.id}
                  totalTracks={(savedAlbum.album as AlbumFull).tracks.total}
                  type="album"
                  liked={liked}
                  saveItem={saveRemoveAlbumsForCurrentUser}
                />
              );
            }
          }}
        />
      );
    } else if (match.params.term === "tracks") {
      return (
        <InfiniteVirtualizedList
          items={tracks}
          totalItems={tracksTotal}
          rowHeight={44}
          containerEl={containerEl}
          type="tracks"
          loadMoreItems={loadMoreTracks}
          renderRow={({ key, index, style }: any) => {
            const item = tracks[index];
            let savedTrack = item as SavedTrack;
            const liked = trackLikes[index];
            if (!tracks[index]) {
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
                  title={savedTrack.track.name}
                  artists={savedTrack.track.artists}
                  duration={savedTrack.track.duration_ms}
                  explicit={savedTrack.track.explicit}
                  type="playlist"
                  popularity={savedTrack.track.popularity}
                  album={savedTrack.track.album.name}
                  style={style}
                  key={savedTrack.track.id}
                  trackId={savedTrack.track.id}
                  index={index}
                  saveTrack={saveRemoveTracksForCurrentUser}
                  liked={liked}
                  albumId={savedTrack.track.album.id}
                />
              );
            }
          }}
        />
      );
    }
  };

  const formatHeading = () => {
    const firstLetter = match.params.term[0].toUpperCase();
    return firstLetter + match.params.term.slice(1, match.params.term.length);
  };

  return (
    <div ref={containerEl} className={LibraryStyles.library}>
      {loading ? (
        <div className="loader-container">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <h1 className={LibraryStyles.heading}>{formatHeading()}</h1>
          {match.params.term === "tracks" && <TrackHeader />}
          {renderList()}
        </React.Fragment>
      )}
    </div>
  );
};

export default connector(MusicLibrary);
