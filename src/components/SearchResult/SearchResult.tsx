import React, { useEffect, useRef } from "react";

import { batch, connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import { AxiosResponse } from "axios";
import {
  fetchSearchData,
  getSearchData,
  setSearchPlaylists,
  setSearchAlbums,
  setSearchTerm,
  setSearchTracks,
  setSearchArtists,
  cleanSearchState,
} from "../../store/actions/search";
import { PlaylistSimplified } from "../../store/types/playlist";
import { AlbumSimplified } from "../../store/types/album";
import { TrackFull } from "../../store/types/index";
import { ArtistFull } from "../../store/types/artist";
import {
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
  saveRemovePlaylistForCurrentUser,
  checkCurrentUserSavedAlbums,
  checkCurrentUserSavedTracks,
  checkUserSavedPlaylist,
  setAlbumLikes,
  setTrackLikes,
  setPlaylistLikes,
} from "../../store/actions/user";
import { setError } from "../../store/actions/error";

import SearchResultStyles from "./SearchResult.module.css";
import ClassicTabStyles from "../Tabs/ClassicTab.module.css";
import { RouteComponentProps, NavLink } from "react-router-dom";
import ClassicTab from "../Tabs/ClassicTab";
import SearchPlaylistCard from "../Card/SearchPlaylist";
import Track from "../Track/Track";
import SearchArtistCard from "../Card/ArtistSearch";
import TrackHeader from "../Track/TrackHeader";
import Spinner from "../Spinner/Spinner";
import InfiniteVirtualizedList from "../InfiniteVirtualizedList/InfiniteVirtualizedList";

const mapStateToProps = (state: RootState) => ({
  loading: state.search.loading,
  playlists: state.search.searchPlaylists,
  userId: state.user.userId,
  accessToken: state.auth.accessToken,
  totalPlaylists: state.search.playlistsTotal,
  albums: state.search.searchAlbums,
  totalAlbums: state.search.albumsTotal,
  playlistsTerm: state.search.playlistsTerm,
  albumsTerm: state.search.albumsTerm,
  tracks: state.search.searchTracks,
  totalTracks: state.search.tracksTotal,
  tracksTerm: state.search.tracksTerm,
  artists: state.search.searchArtists,
  artistsTerm: state.search.artistsTerm,
  totalArtists: state.search.artistsTotal,
  error: state.error.errorMsg,
  subErrorMsg: state.error.subMsg,
  trackLikes: state.user.trackLikes,
  albumLikes: state.user.albumLikes,
  playlistLikes: state.user.playlistLikes,
});
const mapDispatchToProps = {
  fetchSearchData,
  setSearchPlaylists,
  setSearchAlbums,
  setSearchTerm,
  setSearchTracks,
  setSearchArtists,
  setError,
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
  saveRemovePlaylistForCurrentUser,
  setAlbumLikes,
  setTrackLikes,
  setPlaylistLikes,
  cleanSearchState,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Params = {
  type: string;
  searchTerm: string;
};

type Props = RouteComponentProps<Params> & ReduxProps;

const SearchResult: React.FC<Props> = ({
  match,
  loading,
  userId,
  fetchSearchData,
  setSearchPlaylists,
  setSearchAlbums,
  setSearchTerm,
  cleanSearchState,
  setSearchTracks,
  setSearchArtists,
  setError,
  setAlbumLikes,
  setTrackLikes,
  setPlaylistLikes,
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
  saveRemovePlaylistForCurrentUser,
  trackLikes,
  albumLikes,
  playlistLikes,
  accessToken,
  playlists,
  totalPlaylists,
  albums,
  totalAlbums,
  playlistsTerm,
  albumsTerm,
  tracks,
  totalTracks,
  tracksTerm,
  artists,
  artistsTerm,
  totalArtists,
  error,
  subErrorMsg,
}) => {
  let containerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (match.params.type === "playlist") {
      // fetchSearchData(match.params.type, match.params.searchTerm);
      if (match.params.searchTerm !== playlistsTerm) {
        fetchSearchData(match.params.type, match.params.searchTerm);
      }
    } else if (match.params.type === "album") {
      // fetchSearchData(match.params.type, match.params.searchTerm);
      if (match.params.searchTerm !== albumsTerm) {
        fetchSearchData(match.params.type, match.params.searchTerm);
      }
    } else if (match.params.type === "track") {
      // fetchSearchData(match.params.type, match.params.searchTerm);
      if (match.params.searchTerm !== tracksTerm) {
        console.log("huhu");
        fetchSearchData(match.params.type, match.params.searchTerm);
      }
    } else if (match.params.type === "artist") {
      // fetchSearchData(match.params.type, match.params.searchTerm);
      if (match.params.searchTerm !== artistsTerm) {
        fetchSearchData(match.params.type, match.params.searchTerm);
      }
    }
    return () => {
      setError("", "");
    };
  }, [
    match.params.type,
    match.params.searchTerm,
    fetchSearchData,
    setError,
    albums.length,
    albumsTerm,
    artists.length,
    artistsTerm,
    playlists.length,
    playlistsTerm,
    tracks.length,
    tracksTerm,
  ]);

  useEffect(() => {
    return () => {
      cleanSearchState();
    };
  }, [cleanSearchState]);

  useEffect(() => {
    setSearchTerm(match.params.searchTerm);
  }, [match.params.searchTerm, setSearchTerm]);

  const renderLinks = () => {
    return (
      <React.Fragment>
        <li>
          <NavLink
            className={ClassicTabStyles.item}
            activeClassName={`${ClassicTabStyles["item--active"]}`}
            to={`/search/playlist/${match.params.searchTerm}`}
          >
            Playlists
          </NavLink>
        </li>
        <li>
          <NavLink
            className={ClassicTabStyles.item}
            activeClassName={`${ClassicTabStyles["item--active"]}`}
            to={`/search/album/${match.params.searchTerm}`}
          >
            Albums
          </NavLink>
        </li>
        <li>
          <NavLink
            className={ClassicTabStyles.item}
            activeClassName={`${ClassicTabStyles["item--active"]}`}
            to={`/search/track/${match.params.searchTerm}`}
          >
            Tracks
          </NavLink>
        </li>
        <li>
          <NavLink
            className={ClassicTabStyles.item}
            activeClassName={`${ClassicTabStyles["item--active"]}`}
            to={`/search/artist/${match.params.searchTerm}`}
          >
            Artists
          </NavLink>
        </li>
      </React.Fragment>
    );
  };

  const loadMoreResults = ({ startIndex }: { startIndex: number }) => {
    return getSearchData(
      match.params.type,
      match.params.searchTerm,
      accessToken,
      startIndex
    )
      .then((response) => {
        if ("playlists" in response.data) {
          const promises: Promise<AxiosResponse<[boolean]>>[] = [];
          response.data.playlists.items.forEach((playlist) => {
            promises.push(
              checkUserSavedPlaylist(playlist.id, userId, accessToken)
            );
          });

          Promise.all(promises)
            .then((res) => {
              const playlistLikes: boolean[] = [];
              res.forEach((response) => playlistLikes.push(...response.data));
              batch(() => {
                setSearchPlaylists(
                  response.data.playlists.items,
                  response.data.playlists.total,
                  "add",
                  match.params.searchTerm
                );

                setPlaylistLikes([...playlistLikes], "add");
              });
            })
            .catch((err) => console.log(err));
        } else if ("albums" in response.data) {
          let albumIds = "";
          response.data.albums.items.forEach((album) => {
            if (albumIds === " ") {
              albumIds += album.id;
            } else {
              albumIds += "," + album.id;
            }
          });
          return checkCurrentUserSavedAlbums(albumIds, accessToken).then(
            (res) => {
              batch(() => {
                setSearchAlbums(
                  response.data.albums.items,
                  response.data.albums.total,
                  "add",
                  match.params.searchTerm
                );
                setAlbumLikes([...res.data], "add");
              });
            }
          );
        } else if ("tracks" in response.data) {
          let trackIds = "";
          response.data.tracks.items.forEach((track) => {
            if (trackIds === " ") {
              trackIds += track.id;
            } else {
              trackIds += "," + track.id;
            }
          });
          return checkCurrentUserSavedTracks(trackIds, accessToken).then(
            (res) => {
              batch(() => {
                setSearchTracks(
                  response.data.tracks.items,
                  response.data.tracks.total,
                  "add",
                  match.params.searchTerm
                );
                setTrackLikes([...res.data], "add");
              });
            }
          );
        } else if ("artists" in response.data) {
          setSearchArtists(
            response.data.artists.items,
            response.data.artists.total,
            "add",
            match.params.searchTerm
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderLists = () => {
    if (match.params.type === "playlist") {
      if (match.params.searchTerm !== playlistsTerm) {
        return null;
      }
      if (!playlists.length) {
        return (
          <div className="error-container--small">
            <div>
              <h1 className="error-heading">
                No results found for " {match.params.searchTerm} "
              </h1>
              <h3 className="error-text">
                Please make sure your words are spelled correctly or use less or
                different keywords.
              </h3>
            </div>
          </div>
        );
      }
      return (
        <InfiniteVirtualizedList
          items={playlists}
          totalItems={totalPlaylists}
          rowHeight={85}
          containerEl={containerEl}
          type="playlists"
          loadMoreItems={loadMoreResults}
          renderRow={({ key, index, style }: any) => {
            const item = playlists[index];
            const liked = playlistLikes[index];
            let playlist = item as PlaylistSimplified;
            if (!playlists[index]) {
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
                  img={playlist.images[0] && playlist.images[0].url}
                  description={
                    (playlist as PlaylistSimplified).owner.display_name
                  }
                  userId={playlist.owner.id}
                  name={playlist.name}
                  itemId={playlist.id}
                  index={index}
                  style={style}
                  key={playlist.id}
                  totalTracks={(playlist as PlaylistSimplified).tracks.total}
                  type="playlist"
                  liked={liked}
                  saveItem={saveRemovePlaylistForCurrentUser}
                />
              );
            }
          }}
        />
      );
    } else if (match.params.type === "album") {
      if (match.params.searchTerm !== albumsTerm) {
        return null;
      }
      if (!albums.length) {
        return (
          <div className="error-container--small">
            <div>
              <h1 className="error-heading">
                No results found for " {match.params.searchTerm} "
              </h1>
              <h3 className="error-text">
                Please make sure your words are spelled correctly or use less or
                different keywords.
              </h3>
            </div>
          </div>
        );
      }
      return (
        <InfiniteVirtualizedList
          items={albums}
          totalItems={totalAlbums}
          rowHeight={85}
          containerEl={containerEl}
          type="albums"
          loadMoreItems={loadMoreResults}
          renderRow={({ key, index, style }: any) => {
            const item = albums[index];
            const liked = albumLikes[index];
            let album = item as AlbumSimplified;
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
                  img={album.images[0] && album.images[0].url}
                  description={(album as AlbumSimplified).artists[0].name}
                  userId={album.artists[0].id}
                  name={album.name}
                  itemId={album.id}
                  index={index}
                  style={style}
                  key={album.id}
                  totalTracks={(album as AlbumSimplified).total_tracks}
                  type="album"
                  liked={liked}
                  saveItem={saveRemoveAlbumsForCurrentUser}
                />
              );
            }
          }}
        />
      );
    } else if (match.params.type === "track") {
      if (match.params.searchTerm !== tracksTerm) {
        return null;
      }
      if (!tracks.length) {
        return (
          <div className="error-container--small">
            <div>
              <h1 className="error-heading">
                No results found for " {match.params.searchTerm} "
              </h1>
              <h3 className="error-text">
                Please make sure your words are spelled correctly or use less or
                different keywords.
              </h3>
            </div>
          </div>
        );
      }
      return (
        <React.Fragment>
          <TrackHeader />
          <InfiniteVirtualizedList
            items={tracks}
            totalItems={totalTracks}
            rowHeight={44}
            containerEl={containerEl}
            type="tracks"
            loadMoreItems={loadMoreResults}
            renderRow={({ key, index, style }: any) => {
              const item = tracks[index];
              let track = item as TrackFull;
              const liked = trackLikes![index];
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
                    title={track.name}
                    artists={track.artists}
                    duration={track.duration_ms}
                    explicit={track.explicit}
                    type="playlist"
                    popularity={track.popularity}
                    album={track.album.name}
                    style={style}
                    key={track.id}
                    trackId={track.id}
                    index={index}
                    saveTrack={saveRemoveTracksForCurrentUser}
                    liked={liked}
                    albumId={track.album.id}
                  />
                );
              }
            }}
          />
        </React.Fragment>
      );
    } else if (match.params.type === "artist") {
      if (match.params.searchTerm !== artistsTerm) {
        return null;
      }
      if (!artists.length) {
        return (
          <div className="error-container--small">
            <div>
              <h1 className="error-heading">
                No results found for " {match.params.searchTerm} "
              </h1>
              <h3 className="error-text">
                Please make sure your words are spelled correctly or use less or
                different keywords.
              </h3>
            </div>
          </div>
        );
      }
      return (
        <InfiniteVirtualizedList
          items={artists}
          totalItems={totalArtists}
          rowHeight={85}
          containerEl={containerEl}
          type="artists"
          loadMoreItems={loadMoreResults}
          renderRow={({ key, index, style }: any) => {
            const item = artists[index];
            let artist = item as ArtistFull;
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
                <SearchArtistCard
                  name={artist.name}
                  style={style}
                  img={artist.images[0] && artist.images[0].url}
                  artistId={artist.id}
                  genres={artist.genres}
                  key={artist.id}
                />
              );
            }
          }}
        />
      );
    }
  };

  return (
    <div ref={containerEl} className={SearchResultStyles.container}>
      <h1 className={SearchResultStyles.heading}>
        Showing {match.params.type + "s"} for " {match.params.searchTerm} "
      </h1>
      <ClassicTab renderLinks={renderLinks} />
      {error ? (
        <div className="error-container--small">
          <div>
            <h1 className="error-heading">{error}</h1>
            <h3 className="error-text">{subErrorMsg}</h3>
          </div>
        </div>
      ) : loading ? (
        <div className="container-spinner">
          <Spinner />
        </div>
      ) : (
        <div>{renderLists()}</div>
      )}
    </div>
  );
};

export default connector(SearchResult);
// Yeah, using CellMeasurerCache#clearAll & List#recomputeRowHeights seemed to do the trick.
