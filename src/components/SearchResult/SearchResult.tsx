import React, { useEffect, useRef } from "react";

import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import {
  fetchSearchData,
  getSearchData,
  setSearchPlaylists,
  setSearchAlbums,
  setSearchTerm,
  setSearchTracks,
  setSearchArtists,
} from "../../store/actions/search";
import { setError } from "../../store/actions/error";

import SearchResultStyles from "./SearchResult.module.css";
import ClassicTabStyles from "../Tabs/ClassicTab.module.css";
import { RouteComponentProps, NavLink } from "react-router-dom";
import ClassicTab from "../Tabs/ClassicTab";
import TrackHeader from "../Track/TrackHeader";
import Spinner from "../Spinner/Spinner";
import InfiniteVirtualizedList from "../InfiniteVirtualizedList/InfiniteVirtualizedList";

const mapStateToProps = (state: RootState) => ({
  loading: state.search.loading,
  playlists: state.search.searchPlaylists,
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
});
const mapDispatchToProps = {
  fetchSearchData,
  setSearchPlaylists,
  setSearchAlbums,
  setSearchTerm,
  setSearchTracks,
  setSearchArtists,
  setError,
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
  fetchSearchData,
  setSearchPlaylists,
  setSearchAlbums,
  setSearchTerm,
  setSearchTracks,
  setSearchArtists,
  setError,
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
    console.log("search");
  });

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
          setSearchPlaylists(
            response.data.playlists.items,
            response.data.playlists.total,
            "add",
            match.params.searchTerm
          );
        } else if ("albums" in response.data) {
          setSearchAlbums(
            response.data.albums.items,
            response.data.albums.total,
            "add",
            match.params.searchTerm
          );
        } else if ("tracks" in response.data) {
          setSearchTracks(
            response.data.tracks.items,
            response.data.tracks.total,
            "add",
            match.params.searchTerm
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
