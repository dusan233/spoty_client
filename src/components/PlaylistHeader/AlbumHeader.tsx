import React, { useCallback } from "react";
import PlaylistHeaderStyles from "./PlaylistHeader.module.css";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";

import { RiPlayListAddLine, RiPlayListLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Dropdown from "../Dropdown/Dropdown";
import { FaHeart } from "react-icons/fa";

interface AlbumProps {
  albumId: string | undefined;
  name: string | undefined;
  artists: any[];
  img: string | undefined;
  totalSongs: number | undefined;
  type: string | undefined;
  dateAdded: string | undefined;
  liked: boolean;
  totalTracks: number;
  saveAlbum: (albumIds: string, index: number, action: string) => Promise<void>;
}

const AlbumHeader: React.FC<AlbumProps> = ({
  name,
  artists,
  img,
  totalSongs,
  type,
  dateAdded,
  liked,
  totalTracks,
  saveAlbum,
  albumId,
}) => {
  const returnType = () => {
    switch (type) {
      case "single":
        return "SINGLE";
      case "album":
        return "ALBUM";
    }
  };

  const saveRemoveAlbum = () => {
    const action = liked ? "remove" : "save";
    if (albumId) {
      saveAlbum(albumId, 0, action);
    }
  };

  // const getArtists = () => {
  //   let artistsString = "";
  //   if (!artists) {
  //     return "";
  //   }
  //   artists.forEach((artist, i) => {
  //     if (i === artists!.length - 1) {
  //       artistsString += artist.name;
  //     } else {
  //       artistsString += artist.name + ", ";
  //     }
  //   });
  //   return artistsString;
  // };

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

  return (
    <div className={PlaylistHeaderStyles.container}>
      <div className={PlaylistHeaderStyles["img-container"]}>
        <img src={img} alt="Poster" />
      </div>
      <div className={PlaylistHeaderStyles.content}>
        <div>
          <h2 className={PlaylistHeaderStyles.type}>{returnType()}</h2>
          <div className={PlaylistHeaderStyles.title}>{name}</div>
          <div
            className={`${PlaylistHeaderStyles.info} ${PlaylistHeaderStyles["info--album"]}`}
          >
            <span>
              By{" "}
              <span className={PlaylistHeaderStyles.owner}>{getArtists()}</span>
            </span>
            <span> - {totalSongs} tracks -</span>

            <span> {dateAdded && dateAdded.slice(0, 4)}</span>
          </div>
          <div className={PlaylistHeaderStyles.controlls}>
            <button className="btn btn--green btn--circle">Play</button>
            <button
              onClick={saveRemoveAlbum}
              className={
                liked ? "btn-round--liked margin-left" : "btn-round margin-left"
              }
            >
              {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
            </button>

            <Dropdown>
              <button className="btn-round margin-left">
                <BsThreeDots />
              </button>
              <div
                className={`${DropdownStyles["dropdown--playlist"]} ${DropdownStyles.dropdown}`}
              >
                <ul>
                  <li>
                    <div
                      onClick={saveRemoveAlbum}
                      className={DropdownStyles.link}
                    >
                      <FaHeart />
                      {liked ? "Remove from library" : "Save to library"}
                    </div>
                  </li>
                  {totalTracks <= 50 ? (
                    <React.Fragment>
                      <li>
                        <div className={DropdownStyles.link}>
                          <RiPlayListAddLine />
                          Add to Playlist
                        </div>
                      </li>
                      <li>
                        <div className={DropdownStyles.link}>
                          <RiPlayListLine />
                          Add to Queue
                        </div>
                      </li>
                    </React.Fragment>
                  ) : null}
                </ul>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AlbumHeader;
