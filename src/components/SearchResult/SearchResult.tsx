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

import SearchResultStyles from "./SearchResult.module.css";
import ClassicTabStyles from "../Tabs/ClassicTab.module.css";
import { RouteComponentProps, NavLink } from "react-router-dom";
import ClassicTab from "../Tabs/ClassicTab";
import SearchPlaylistCard from "../Card/SearchPlaylist";
import Spinner from "../Spinner/Spinner";
import InfiniteVirtualizedList from "../InfiniteVirtualizedList/InfiniteVirtualizedList";
import { PlaylistSimplified } from "../../store/types/playlist";
import { AlbumSimplified } from "../../store/types/album";
import { TrackFull } from "../../store/types";
import { ArtistFull } from "../../store/types/artist";

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
});
const mapDispatchToProps = {
  fetchSearchData,
  setSearchPlaylists,
  setSearchAlbums,
  setSearchTerm,
  setSearchTracks,
  setSearchArtists,
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
}) => {
  let containerEl = useRef<HTMLDivElement>(null);

  // let rowHeight = 85;
  // let type: string = "playlists";
  // let items:
  //   | PlaylistSimplified[]
  //   | AlbumSimplified[]
  //   | TrackFull[]
  //   | ArtistFull[] = [];
  // let total: number = 0;
  // if (match.params.type === "playlist") {
  //   type = "playlists";
  //   items = playlists;
  //   total = totalPlaylists;
  // } else if (match.params.type === "album") {
  //   type = "albums";
  //   items = albums;
  //   total = totalAlbums;
  // } else if (match.params.type === "track") {
  //   type = "tracks";
  //   items = tracks;
  //   total = totalTracks;
  //   rowHeight = 44;
  // } else if (match.params.type === "artist") {
  //   type = "artists";
  //   items = artists;
  //   total = totalArtists;
  // }

  useEffect(() => {
    if (match.params.type === "playlist") {
      if (playlists.length !== 0) {
        if (match.params.searchTerm !== playlistsTerm) {
          fetchSearchData(match.params.type, match.params.searchTerm);
        }
      } else {
        fetchSearchData(match.params.type, match.params.searchTerm);
      }
    } else if (match.params.type === "album") {
      if (albums.length !== 0) {
        if (match.params.searchTerm !== albumsTerm) {
          fetchSearchData(match.params.type, match.params.searchTerm);
        }
      } else {
        fetchSearchData(match.params.type, match.params.searchTerm);
      }
    } else if (match.params.type === "track") {
      if (tracks.length !== 0) {
        if (match.params.searchTerm !== tracksTerm) {
          fetchSearchData(match.params.type, match.params.searchTerm);
        }
      } else {
        fetchSearchData(match.params.type, match.params.searchTerm);
      }
    } else if (match.params.type === "artist") {
      if (artists.length !== 0) {
        if (match.params.searchTerm !== artistsTerm) {
          fetchSearchData(match.params.type, match.params.searchTerm);
        }
      } else {
        fetchSearchData(match.params.type, match.params.searchTerm);
      }
    }
  }, [match.params.type, match.params.searchTerm, fetchSearchData]);

  useEffect(() => {
    setSearchTerm(match.params.searchTerm);
  }, []);

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
    ).then((response) => {
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
    });
  };

  const renderLists = () => {
    if (match.params.type === "playlist") {
      if (match.params.searchTerm !== playlistsTerm) {
        return null;
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
      return (
        <InfiniteVirtualizedList
          items={tracks}
          totalItems={totalTracks}
          rowHeight={44}
          containerEl={containerEl}
          type="tracks"
          loadMoreItems={loadMoreResults}
        />
      );
    } else if (match.params.type === "artist") {
      if (match.params.searchTerm !== artistsTerm) {
        return null;
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
      {loading ? (
        <div className="container-spinner">
          <Spinner />
        </div>
      ) : (
        <div>
          {renderLists()}
          {/* <InfiniteVirtualizedList
            items={items}
            totalItems={total}
            rowHeight={rowHeight}
            containerEl={containerEl}
            type={type}
            loadMoreItems={loadMoreResults}
          /> */}
        </div>
      )}
    </div>
  );
};

export default connector(SearchResult);
// Yeah, using CellMeasurerCache#clearAll & List#recomputeRowHeights seemed to do the trick.
