import React from "react";
import TrackStyles from "./Track.module.css";
import { BsClockHistory } from "react-icons/bs";

import { AiOutlineLike } from "react-icons/ai";

interface Props {
  type?: string;
  hidePopularity?: boolean;
}
const TrackHeader: React.FC<Props> = ({ type, hidePopularity }) => {
  return (
    <div
      className={`${TrackStyles["datagrid-row"]} ${TrackStyles["datagrid-row-header"]}`}
    >
      <div
        className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-action"]} ${TrackStyles["datagrid-cell-header"]}`}
      ></div>
      <div
        className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-love"]} `}
      ></div>
      <div
        className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-title"]} ${TrackStyles["datagrid-cell-header"]}`}
      >
        TITLE
      </div>

      <div
        className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-explicit"]}`}
      ></div>
      {type !== "album" && (
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-artist"]} ${TrackStyles["datagrid-cell-header"]}`}
        >
          ARTIST
        </div>
      )}

      {type !== "album" && (
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-album"]} ${TrackStyles["datagrid-cell-header"]}`}
        >
          ALBUM
        </div>
      )}
      <div
        className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-options"]}`}
      ></div>
      <div
        className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-duration"]} ${TrackStyles["datagrid-cell-header-icon"]}`}
      >
        <BsClockHistory />
      </div>
      {!hidePopularity && (
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-popularity"]} ${TrackStyles["datagrid-cell-header-icon"]}`}
        >
          <AiOutlineLike />
        </div>
      )}
    </div>
  );
};

export default TrackHeader;
