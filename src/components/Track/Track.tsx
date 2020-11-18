import React, { useCallback, useState } from "react";
import TrackStyles from "./Track.module.css";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Modal from "react-modal";
import AddToPlaylist from "../AddToPlaylist/AddToPlaylist";
import platingGif from '../../assets/equaliser-animated-green.73b73928.gif'
import {
  BsPlayFill,
  BsMusicNote,
  BsThreeDots,
  BsFillPersonFill,
  BsPauseFill,
} from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { RiPlayListLine, RiPlayListAddLine, RiAlbumLine } from "react-icons/ri";

import { Link } from "react-router-dom";

import { ArtistSimplified } from "../../store/types/artist";
import useSelected from "../../hooks/useSelected";
import Dropdown from "../Dropdown/Dropdown";
import { playPlaylistSongs } from "../../store/actions/music";

interface TrackProps {
  title: string;
  artists: ArtistSimplified[];
  album?: string;
  albumId?: string;
  playlistOwnerId?: string;
  playlistId?: string;
  searchId?: string;
  userId?: string;
  style?: any;
  index: number;
  duration: number;
  explicit: boolean;
  popularity?: number;
  type: string;
  hidePopularity?: boolean;
  liked?: boolean;
  trackId: string;
  uri: string;
  isPlaying: boolean;
  preview_url: string | null;
  listId: string | undefined;
  currentPlayingListId: string;
  currentPlayingSongIndex: number;
  selectedSong?: boolean;
  saveTrack: (trackIds: string, index: number, action: string) => Promise<void>;
  remvoeTrackFromPlaylist?: (
    trackUri: string,
    index: number,
    playlistId: string | undefined
  ) => Promise<void>;
  playPlaylist: (playlistId: string, songIndex: number, endIndex: number) => Promise<void>
  playPause: (isPlaying: boolean) => void
  
}

Modal.setAppElement("#modal");

const Track: React.FC<TrackProps> = 
React.memo(
  ({
    title,
    artists,
    album,
    style,
    index,
    duration,
    explicit,
    popularity,
    searchId,
    type,
    hidePopularity,
    albumId,
    liked,
    trackId,
    isPlaying,
    currentPlayingListId,
    currentPlayingSongIndex,
    uri,
    selectedSong,
    userId,
    playlistOwnerId,
    playlistId,
    listId,
    preview_url,
    saveTrack,
    remvoeTrackFromPlaylist,
    playPlaylist,
    playPause
  }) => {
    const [selected, rowRef] = useSelected();
    const [modalIsOpen, setModal] = useState(false);

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const removeTrackFromPlaylist = () => {
      remvoeTrackFromPlaylist &&
        remvoeTrackFromPlaylist(uri, index, playlistId);
    };

    const getArtists = useCallback(() => {
      let artistsString: any[] = [];
      if (!artists) {
        return "";
      }
      artists.forEach((artist, i) => {
        if (i === artists!.length - 1) {
          artistsString.push(
            <React.Fragment key={artist.id}>
              <Link title={artist.name} to={`/artist/${artist.id}`}>
                {artist.name}
              </Link>
            </React.Fragment>
          );
        } else {
          artistsString.push(
            <React.Fragment key={artist.id}>
              <Link title={artist.name} to={`/artist/${artist.id}`}>
                {artist.name}
              </Link>{" "}
              ,{" "}
            </React.Fragment>
          );
        }
      });
      return artistsString;
    }, [artists]);

    const saveRemoveUserTracks = () => {
      const action = liked ? "remove" : "save";
      if(type === "queue" && !selectedSong) {
        saveTrack(trackId,  index + 1, action);
      }else {
        saveTrack(trackId, index, action);
      }
     
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


    const skipToCertainTrack = useCallback((trackIndex: number) => {
      if(type === "search" && listId) {
        if(trackId === currentPlayingListId && currentPlayingSongIndex === index) {
          playPause(!isPlaying);
        }else {
          if(searchId) playPlaylist(searchId, trackIndex, 0);
        }
      }else if(type === "queue"){
        if(index === 0  && selectedSong) {
          playPause(!isPlaying)
        }else {
          if(listId) playPlaylist(listId, currentPlayingSongIndex + trackIndex + 1, 50);
        }
      }else {
        if(listId === currentPlayingListId && currentPlayingSongIndex === index) {
          playPause(!isPlaying)
        }else {
          if(listId) playPlaylist(listId, trackIndex, 50);
        }
      }
    }, [index, isPlaying, searchId, listId, trackId, playPause, selectedSong, playPlaylist, currentPlayingSongIndex, currentPlayingListId, type])

    

    const returnPlayPauseButton = () => {
      if(type === "queue") return index === 0  && selectedSong &&  isPlaying ? <BsPauseFill /> : <BsPlayFill />
        return listId === currentPlayingListId && currentPlayingSongIndex === index ? isPlaying ? <BsPauseFill />  : <BsPlayFill />: <BsPlayFill />
    }

    const songSelected = () => {
      if(type === "queue") return index === 0 && selectedSong;
        return listId === currentPlayingListId && currentPlayingSongIndex === index 
   }

    return (
      <div
        className={TrackStyles["datagrid-row"]}
        style={{ ...style, background: selected && "#ffffff29" }}
        ref={rowRef}
      >
        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          closeTimeoutMS={400}
        >
          <AddToPlaylist trackUri={uri} closeModal={closeModal} />
        </Modal>

        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-action"]}`}
        >
          <button
            title={preview_url ? 'play' : 'no song preview'}
            disabled={!preview_url}
            onClick={() => {
              skipToCertainTrack(index);
            }}
            className={
              selected ? `${TrackStyles["btn--selected"]}` : TrackStyles.btn
            }
          >
             {returnPlayPauseButton()}
          </button>
          {songSelected() && isPlaying ? <img src={platingGif} alt=""/> : <BsMusicNote /> }
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
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-title"]} ${songSelected() && TrackStyles["datagrid-cell--playing"]}`}
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
        {(type !== "album") && (
          <div
            className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-artist"]}`}
          >
            {getArtists()}
          </div>
        )}
        <div
          className={`${TrackStyles["datagrid-cell"]} ${TrackStyles["datagrid-cell-album"]} ${songSelected() && TrackStyles["datagrid-cell--playing"]}  `}
        >
          <Link title={album}  to={`/album/${albumId}`}>
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
                  <div onClick={openModal} className={DropdownStyles.link}>
                    <RiPlayListAddLine />
                    Add to Playlist
                  </div>
                </li>
                {userId && playlistOwnerId && userId === playlistOwnerId && (
                  <li>
                    <div
                      onClick={removeTrackFromPlaylist}
                      className={DropdownStyles.link}
                    >
                      <RiPlayListAddLine />
                      Remove from this playlist
                    </div>
                  </li>
                )}
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
                  <div className={DropdownStyles.link}>
                    <BsFillPersonFill />
                    Go to Artists
                    <div className={DropdownStyles.dropdown__sec}>
                      <ul>
                        {artists.map((artist, i) => {
                          return (
                            <li key={i}>
                              <Link
                                className={DropdownStyles.link}
                                to={`/artist/${artist.id}`}
                              >
                                {artist.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
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
