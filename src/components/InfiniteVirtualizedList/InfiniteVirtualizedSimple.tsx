import React from "react";

import { AutoSizer, InfiniteLoader, List } from "react-virtualized";
import { AlbumSimplified, SavedAlbum } from "../../store/types/album";
import { SavedTrack, TrackFull } from "../../store/types";
import { ArtistFull } from "../../store/types/artist";

type Item =
  | {
      id: string;
      name: string;
    }
  | AlbumSimplified
  | TrackFull
  | ArtistFull
  | SavedAlbum
  | SavedTrack;

type Props = {
  items: Item[];
  totalItems: number;
  rowHeight: number;
  loadMoreItems: (obj: any) => Promise<void>;
  height: number;
  renderRow: ({ key, index, style }: any) => JSX.Element | undefined;
};

const InfiniteVirtualizedList: React.FC<Props> = ({
  items,
  totalItems,
  rowHeight,
  height,
  loadMoreItems,
  renderRow,
}) => {
  const rowCount =
    totalItems === items.length ? items.length : items.length + 1;

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!items[index];
  };

  return (
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
              className="Listar"
              width={width}
              height={height}
              onRowsRendered={onRowsRendered}
              rowCount={rowCount}
              rowHeight={rowHeight}
              rowRenderer={renderRow}
              ref={registerChild}
            />
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default InfiniteVirtualizedList;
