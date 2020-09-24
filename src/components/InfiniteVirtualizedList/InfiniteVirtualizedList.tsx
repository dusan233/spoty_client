import React, { RefObject, useEffect, useRef } from "react";

import {
  WindowScroller,
  AutoSizer,
  InfiniteLoader,
  List,
} from "react-virtualized";
import Spinner from "../Spinner/Spinner";
import { PlaylistSimplified } from "../../store/types/playlist";
import { AlbumSimplified } from "../../store/types/album";
import SearchPlaylistCard from "../Card/SearchPlaylist";
import SearchArtistCard from "../Card/ArtistSearch";
import { TrackFull } from "../../store/types";
import Track from "../Track/Track";
import { ArtistFull } from "../../store/types/artist";

type Item = PlaylistSimplified | AlbumSimplified | TrackFull | ArtistFull;

type Props = {
  items: Item[];
  totalItems: number;
  rowHeight: any;
  containerEl: RefObject<HTMLDivElement>;
  loadMoreItems: (obj: any) => Promise<void>;
  type: string;
  itemLikes?: boolean[];
  saveItem?: (itemIds: string, index: number) => Promise<void>;
};

const InfiniteVirtualizedList: React.FC<Props> = ({
  items,
  totalItems,
  rowHeight,
  containerEl,
  loadMoreItems,
  saveItem,
  itemLikes,
  type,
}) => {
  const nekiRef = useRef<any>();
  useEffect(() => {
    (nekiRef.current as List).recomputeRowHeights();
  }, [type]);
  const rowCount =
    totalItems === items.length ? items.length : items.length + 1;

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!items[index];
  };

  const renderRow = ({ key, index, style }: any) => {
    const itemr = items[index];

    if (!items[index]) {
      return (
        <div style={{ ...style }} key={key} className="loader-container">
          <Spinner />
        </div>
      );
    } else {
      switch (type) {
        case "playlists":
          let playlist = itemr as PlaylistSimplified;
          return (
            <SearchPlaylistCard
              img={playlist.images[0] && playlist.images[0].url}
              description={(playlist as PlaylistSimplified).owner.display_name}
              name={playlist.name}
              itemId={playlist.id}
              index={index}
              style={style}
              key={playlist.id}
              totalTracks={(playlist as PlaylistSimplified).tracks.total}
              type="playlist"
            />
          );
        case "albums":
          let album = itemr as AlbumSimplified;
          return (
            <SearchPlaylistCard
              img={album.images[0] && album.images[0].url}
              description={(album as AlbumSimplified).artists[0].name}
              name={album.name}
              itemId={album.id}
              index={index}
              style={style}
              key={album.id}
              totalTracks={(album as AlbumSimplified).total_tracks}
              type="album"
            />
          );
        case "tracks":
          let track = itemr as TrackFull;
          const liked = itemLikes![index];
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
              saveTrack={saveItem!}
              liked={liked}
              albumId={track.album.id}
            />
          );
        case "artists":
          let artist = itemr as ArtistFull;
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
    }
  };

  return (
    <WindowScroller scrollElement={containerEl.current}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            // />
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreItems}
              rowCount={rowCount}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  autoHeight
                  className="Liste"
                  width={width}
                  height={height}
                  isScrolling={isScrolling}
                  onRowsRendered={onRowsRendered}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  rowCount={rowCount}
                  rowHeight={rowHeight}
                  rowRenderer={renderRow}
                  ref={nekiRef}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};

export default InfiniteVirtualizedList;
