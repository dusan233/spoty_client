import React, { useCallback } from "react";
import TrackStyles from "./Track.module.css";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import {
  BsPlayFill,
  BsMusicNote,
  BsThreeDots,
  BsFillPersonFill,
} from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { RiPlayListLine, RiPlayListAddLine, RiAlbumLine } from "react-icons/ri";

import { Link } from "react-router-dom";

import { ArtistSimplified } from "../../store/types/artist";
import useSelected from "../../hooks/useSelected";
import Dropdown from "../Dropdown/Dropdown";

interface TrackProps {
  title: string;
  artists: ArtistSimplified[];
  album?: string;
  albumId?: string;
  style?: any;
  index: number;
  duration: number;
  explicit: boolean;
  popularity?: number;
  type: string;
  hidePopularity?: boolean;
  liked?: boolean;
  trackId: string;
  saveTrack: (trackIds: string, index: number, action: string) => Promise<void>;
}

const Track: React.FC<TrackProps> = React.memo(
  ({
    title,
    artists,
    album,
    style,
    index,
    duration,
    explicit,
    popularity,
    type,
    hidePopularity,
    albumId,
    liked,
    trackId,
    saveTrack,
  }) => {
    const [selected, rowRef] = useSelected();

    const getArtists = useCallback(() => {
      let artistsString: any[] = [];
      if (!artists) {
        return "";
      }
      artists.forEach((artist, i) => {
        if (i === artists!.length - 1) {
          artistsString.push(
            <React.Fragment key={artist.id}>
              <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
            </React.Fragment>
          );
        } else {
          artistsString.push(
            <React.Fragment key={artist.id}>
              <Link to={`/artist/${artist.id}`}>{artist.name}</Link> ,{" "}
            </React.Fragment>
          );
        }
      });
      return artistsString;
    }, [artists]);

    const saveRemoveUserTracks = () => {
      const action = liked ? "remove" : "save";
      saveTrack(trackId, index, action);
    };

    const definePopularity = useCallback(() => {
      if (typeof popularity === "number") {
        const percentage = popularity;
        const lines = (percentage * 8) / 100;
        return Math.round(lines);
      }
      return 0;
    }, [popularity]);

    const renderPopularityLines = useCallback(() => {
      const lineElements: JSX.Element[] = [];
      const linesNumber = definePopularity();
      for (let i = 1; i < 9; i++) {
        if (i <= linesNumber) {
          const lineElement = (
            <div key={i} className={TrackStyles.fullLine}>
              {" "}
            </div>
          );
          lineElements.push(lineElement);
        } else {
          const lineElement = (
            <div key={i} className={TrackStyles.emptyLine}>
              {" "}
            </div>
          );
          lineElements.push(lineElement);
        }
      }
      return lineElements;
    }, [definePopularity]);

    const getSongDuration = useCallback((millis: number | undefined) => {
      if (!millis) return "";
      const minutes = Math.floor(millis / 60000);
      const seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
    }, []);

    return (
      <div
        className={TrackStyles["datagrid-row"]}
        style={{ ...style, background: selected && "#ffffff29" }}
        ref={rowRef}
      >
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-action"]}`}
        >
          <button
            className={
              selected ? `${TrackStyles["btn--selected"]}` : TrackStyles.btn
            }
          >
            <BsPlayFill />
          </button>
          <BsMusicNote />
        </div>
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-love"]}`}
        >
          {liked ? (
            <span
              onClick={saveRemoveUserTracks}
              title="Remove from your liked songs"
              className={`${TrackStyles["like--filled"]}`}
            >
              <FaHeart />
            </span>
          ) : (
            <span
              onClick={saveRemoveUserTracks}
              title="Save to your liked songs"
              className={TrackStyles.like}
            >
              <FaRegHeart />
            </span>
          )}
        </div>
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-title"]}`}
        >
          <span title={title}>{title}</span>
        </div>
        <div
          className={`${TrackStyles["datagrid-cell"]} ${
            selected
              ? TrackStyles["datagrid-cell-explicit--selected"]
              : TrackStyles["datagrid-cell-explicit"]
          }`}
        >
          {explicit && <span>Explicit</span>}
        </div>
        {type === "playlist" && (
          <div
            className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-artist"]}`}
          >
            {getArtists()}
          </div>
        )}
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-album"]} `}
        >
          <Link title={album} to={`/album/${albumId}`}>
            {album}
          </Link>
        </div>
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-options"]}`}
        >
          <Dropdown>
            <div
              className={
                selected ? `${TrackStyles["dots--selected"]}` : TrackStyles.dots
              }
            >
              <BsThreeDots />
            </div>
            <div className={DropdownStyles.dropdown}>
              <ul>
                <li>
                  <div
                    onClick={saveRemoveUserTracks}
                    className={DropdownStyles.link}
                  >
                    <FaHeart />
                    {liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
                  </div>
                </li>
                <li>
                  <Link className={DropdownStyles.link} to="/">
                    <RiPlayListLine />
                    Add to Queue
                  </Link>
                </li>
                <li>
                  <Link className={DropdownStyles.link} to="/">
                    <RiPlayListAddLine />
                    Add to Playlist
                  </Link>
                </li>
                {albumId && (
                  <li>
                    <Link
                      className={DropdownStyles.link}
                      to={`/album/${albumId}`}
                    >
                      <RiAlbumLine />
                      Go to Album
                    </Link>
                  </li>
                )}
                <li>
                  <Link className={DropdownStyles.link} to="/">
                    <BsMusicNote />
                    Show Credits
                  </Link>
                </li>
                <li>
                  <Link className={DropdownStyles.link} to="/">
                    <BsFillPersonFill />
                    Go to Artist
                  </Link>
                </li>
              </ul>
            </div>
          </Dropdown>
        </div>
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-duration"]}`}
        >
          {getSongDuration(duration)}
        </div>
        {!hidePopularity && (
          <div
            className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-popularity"]}`}
          >
            {renderPopularityLines()}
          </div>
        )}
      </div>
    );
  },
  function areEqual(prevProps, nextProps) {
    let isEqual = true;

    if (JSON.stringify(prevProps) !== JSON.stringify(nextProps)) {
      isEqual = false;
    }

    return isEqual;
  }
);

export default Track;
