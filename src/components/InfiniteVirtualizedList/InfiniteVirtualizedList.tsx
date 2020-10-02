import React, { RefObject, useEffect, useRef } from "react";

import {
  WindowScroller,
  AutoSizer,
  InfiniteLoader,
  List,
} from "react-virtualized";
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
  containerEl: RefObject<HTMLDivElement>;
  loadMoreItems: (obj: any) => Promise<void>;
  type: string;
  renderRow: ({ key, index, style }: any) => JSX.Element | undefined;
};

const InfiniteVirtualizedList: React.FC<Props> = ({
  items,
  totalItems,
  rowHeight,
  containerEl,
  loadMoreItems,
  renderRow,
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
