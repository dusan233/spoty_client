import React, { useEffect, useRef } from "react";
import LibraryStyles from "./MusicLibrary.module.css";
import { RouteComponentProps } from "react-router-dom";
import { ConnectedProps, connect, batch } from "react-redux";
import { RootState } from "../../store/reducers/index";
import {
  getUsersAlbums,
  getUserTracks,
  getCurrentUserFollowedArtists,
  setLibraryLoading,
  fetchUserTracks,
  fetchUserAlbums,
  setLibraryTracks,
  setLibraryAlbums,
  fetchUserArtists,
  setLibraryArtists,
} from "../../store/actions/library";
import {
  BsFillPersonDashFill,
  BsMusicNoteBeamed,
  BsMusicNote,
} from "react-icons/bs";
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
import ArtistCard from "../Card/ArtistSearch";
import Track from "../Track/Track";
import TrackHeader from "../Track/TrackHeader";
import { SavedTrack } from "../../store/types";
import { ArtistFull } from "../../store/types/artist";

const mapStateToProps = (state: RootState) => ({
  loading: state.library.loading,
  albums: state.library.albums,
  albumsTotal: state.library.albumsTotal,
  albumLikes: state.user.albumLikes,
  tracks: state.library.tracks,
  tracksTotal: state.library.tracksTotal,
  trackLikes: state.user.trackLikes,
  accessToken: state.auth.accessToken,
  artists: state.library.artists,
  artistsTotal: state.library.artistsTotal,
  library: state.library,
  errorMsg: state.error.errorMsg,
  subError: state.error.subMsg,
});

const mapDispatchToProps = {
  getUsersAlbums,
  getUserTracks,
  setTrackLikes,
  setAlbumLikes,
  setLibraryArtists,
  setLibraryLoading,
  setLibraryTracks,
  setLibraryAlbums,
  saveRemoveAlbumsForCurrentUser,
  saveRemoveTracksForCurrentUser,
  getCurrentUserFollowedArtists,
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
  setLibraryArtists,
  getCurrentUserFollowedArtists,
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
  artists,
  artistsTotal,
  errorMsg,
  subError,
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
    if (match.params.term === "artists") {
      getCurrentUserFollowedArtists();
    }
    return () => {
      setLibraryLoading(true);
    };
  }, [
    match.params.term,
    getUsersAlbums,
    getUserTracks,
    getCurrentUserFollowedArtists,
    setLibraryLoading,
  ]);

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

  const loadMoreArtists = ({ startIndex }: { startIndex: number }) => {
    const lastArtistId = artists[artists.length - 1].id;
    return fetchUserArtists(lastArtistId, accessToken)
      .then((res) => {
        setLibraryArtists(
          res.data.artists.items,
          res.data.artists.total,
          "add"
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
      if (!albums.length)
        return (
          <div className="error-container--small">
            <div>
              <div className="error-icon">
                <BsMusicNoteBeamed />
              </div>
              <h1 className="error-heading">Follow your first album</h1>
              <h3 className="error-text margin-bottom">
                Save albums by tapping the heart icon.
              </h3>
            </div>
          </div>
        );
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
                  key={savedAlbum.album.id + index}
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
      if (!tracks.length)
        return (
          <div className="error-container--small">
            <div>
              <div className="error-icon">
                <BsMusicNote />
              </div>
              <h1 className="error-heading">Songs you like will appear here</h1>
              <h3 className="error-text margin-bottom">
                Save songs by tapping the heart icon.
              </h3>
            </div>
          </div>
        );
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
                  key={savedTrack.track.id + index}
                  trackId={savedTrack.track.id}
                  index={index}
                  uri={savedTrack.track.uri}
                  saveTrack={saveRemoveTracksForCurrentUser}
                  skipToCertainTrack={() => {}}
                  liked={liked}
                  albumId={savedTrack.track.album.id}
                />
              );
            }
          }}
        />
      );
    } else if (match.params.term === "artists") {
      if (!artists.length)
        return (
          <div className="error-container--small">
            <div>
              <div className="error-icon">
                <BsFillPersonDashFill />
              </div>
              <h1 className="error-heading">Follow your first artist</h1>
              <h3 className="error-text margin-bottom">
                Follow artists you like by tapping the follow button.
              </h3>
            </div>
          </div>
        );
      return (
        <InfiniteVirtualizedList
          items={artists}
          totalItems={artistsTotal}
          rowHeight={85}
          containerEl={containerEl}
          type="playlists"
          loadMoreItems={loadMoreArtists}
          renderRow={({ key, index, style }: any) => {
            const item = artists[index];
            let savedArtist = item as ArtistFull;
            if (!artists[index]) {
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
                <ArtistCard
                  key={savedArtist.id + index}
                  artistId={savedArtist.id}
                  img={savedArtist.images[0].url}
                  name={savedArtist.name}
                  genres={savedArtist.genres}
                  style={style}
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
      ) : errorMsg ? (
        <div className="error-container">
          <div>
            <div className="error-icon">
              <BsMusicNoteBeamed />
            </div>
            <h1 className="error-heading">{errorMsg}</h1>
            <h3 className="error-text">{subError}</h3>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <h1 className={LibraryStyles.heading}>{formatHeading()}</h1>
          {match.params.term === "tracks" && tracks.length && <TrackHeader />}
          {renderList()}
        </React.Fragment>
      )}
    </div>
  );
};

export default connector(MusicLibrary);
