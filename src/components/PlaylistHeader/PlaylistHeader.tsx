import React from "react";
import PlaylistHeaderStyles from "./PlaylistHeader.module.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import NoImage from "../../assets/264x264-000000-80-0-0.jpg";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Dropdown from "../Dropdown/Dropdown";

interface PlaylistProps {
  name: string;
  owner: string;
  ownerId: string;
  followers: number;
  img: string | undefined;
  description: string | null;
  totalSongs: number;
  type: string;
  liked: boolean;
  playlistId: string | undefined;
  userId: string;
  savePlaylist: (
    playlistId: string,
    index: number,
    action: string
  ) => Promise<void>;
}

const PlaylistHeader: React.FC<PlaylistProps> = ({
  name,
  owner,
  followers,
  img,
  description,
  totalSongs,
  liked,
  playlistId,
  userId,
  ownerId,
  savePlaylist,
}) => {
  const saveRemoveAlbum = () => {
    const action = liked ? "remove" : "save";
    if (playlistId) {
      savePlaylist(playlistId, 0, action);
    }
  };

  return (
    <div className={PlaylistHeaderStyles.container}>
      <div className={PlaylistHeaderStyles["img-container"]}>
        <img src={img || NoImage} alt="Poster" />
      </div>
      <div className={PlaylistHeaderStyles.content}>
        <div>
          <h2 className={PlaylistHeaderStyles.type}>PLAYLIST</h2>
          <div className={PlaylistHeaderStyles.title}>{name}</div>
          {description && (
            <h2
              dangerouslySetInnerHTML={{ __html: description }}
              className={PlaylistHeaderStyles.description}
            ></h2>
          )}
          <div className={PlaylistHeaderStyles.info}>
            <span>
              Created by{" "}
              <span className={PlaylistHeaderStyles.owner}>{owner}</span>
            </span>
            <span> - {totalSongs} tracks -</span>
            <span>
              {" "}
              {followers!.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              followers
            </span>
          </div>
          <div className={PlaylistHeaderStyles.controlls}>
            {totalSongs ? (
              <button className="btn btn--green btn--circle">Play</button>
            ) : null}

            {userId === ownerId ? null : (
              <button
                className={
                  liked
                    ? "btn-round--liked margin-left"
                    : "btn-round margin-left"
                }
              >
                {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
              </button>
            )}

            <Dropdown>
              <button className="btn-round margin-left">
                <BsThreeDots />
              </button>
              <div
                className={`${DropdownStyles["dropdown--playlist"]} ${DropdownStyles.dropdown}`}
              >
                <ul>
                  <li>
                    <Link className={DropdownStyles.link} to="/">
                      Save to your Liked Songs
                    </Link>
                  </li>
                  <li>
                    <Link className={DropdownStyles.link} to="/">
                      Add to Queue
                    </Link>
                  </li>
                  <li>
                    <Link className={DropdownStyles.link} to="/">
                      Add to Playlist
                    </Link>
                  </li>
                  <li>
                    <Link className={DropdownStyles.link} to="/">
                      Show Credits
                    </Link>
                  </li>
                  <li>
                    <Link className={DropdownStyles.link} to="/">
                      Go to Artist
                    </Link>
                  </li>
                </ul>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;
