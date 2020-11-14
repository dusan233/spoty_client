import React, { useEffect, useRef } from "react";
import SidebarPlaylistsStyles from "./SidebarPlaylists.module.css";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import {
  getCurrentUserPlaylists,
  fetchCurrentUserPlaylists,
  setLibraryPlaylists,
} from "../../store/actions/library";
import { PlaylistSimplified } from "../../store/types/playlist";
import { Link } from "react-router-dom";

import InfiniteVirtualizedList from "../InfiniteVirtualizedList/InfiniteVirtualizedList";

const mapStateToProps = (state: RootState) => ({
  accessToken: state.auth.accessToken,
  loading: state.library.loadingPlaylists,
  playlists: state.library.playlists,
  playlistsTotal: state.library.playlistsTotal,
});

const mapDispatchToProps = {
  getCurrentUserPlaylists,
  setLibraryPlaylists,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

const SidebarPlaylists: React.FC<Props> = ({
  getCurrentUserPlaylists,
  setLibraryPlaylists,
  loading,
  playlists,
  playlistsTotal,
  accessToken,
}) => {
  let containerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrentUserPlaylists();
  }, [getCurrentUserPlaylists]);

  const loadMorePlaylists = ({ startIndex }: { startIndex: number }) => {
    return fetchCurrentUserPlaylists(playlists.length, accessToken).then(
      (res) => {
        setLibraryPlaylists(res.data.items, res.data.total, "add");
      }
    );
  };

  return (
    <div ref={containerEl} className={SidebarPlaylistsStyles.list}>
      {loading ? (
        <React.Fragment>
          <div className={SidebarPlaylistsStyles.item__placeholder}>
            <div
              className={`${SidebarPlaylistsStyles["item__text-placeholder"]}`}
            >
              s
            </div>
          </div>
          <div className={SidebarPlaylistsStyles.item__placeholder}>
            <div
              className={`${SidebarPlaylistsStyles["item__text-placeholder"]}`}
            >
              s
            </div>
          </div>
          <div className={SidebarPlaylistsStyles.item__placeholder}>
            <div
              className={`${SidebarPlaylistsStyles["item__text-placeholder"]}`}
            >
              s
            </div>
          </div>
        </React.Fragment>
      ) : containerEl.current ?
      <InfiniteVirtualizedList
      items={playlists}
      totalItems={playlistsTotal}
      rowHeight={30}
      containerEl={containerEl}
      type="playlists"
      loadMoreItems={loadMorePlaylists}
      renderRow={({ key, index, style }: any) => {
        const item = playlists[index];
        let playlist = item as PlaylistSimplified;
        if (!playlists[index]) {
          return (
            <div
              key={key}
              style={{ ...style }}
              className={SidebarPlaylistsStyles.item__placeholder}
            >
              <div
                className={`${SidebarPlaylistsStyles["item__text-placeholder"]}`}
              >
                s
              </div>
            </div>
          );
        } else {
          return (
            <div
              style={{ ...style }}
              key={playlist.id}
              className={SidebarPlaylistsStyles.item}
            >
              <Link
                to={`/playlist/${playlist.id}`}
                className={SidebarPlaylistsStyles.item__text}
              >
                {playlist.name}
              </Link>
            </div>
          );
        }
      }}
    />
      : null}
      ;
    </div>
  );
};

export default connector(SidebarPlaylists);
