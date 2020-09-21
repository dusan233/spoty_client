import React from "react";
import PlaylistHeaderStyles from "./PlaylistHeader.module.css";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Dropdown from "../Dropdown/Dropdown";

interface PlaylistProps {
  name: string;
  owner: string;
  followers: number;
  img: string | undefined;
  description: string | null;
  totalSongs: number;
  type: string;
}

const PlaylistHeader: React.FC<PlaylistProps> = ({
  name,
  owner,
  followers,
  img,
  description,
  totalSongs,
}) => {
  return (
    <div className={PlaylistHeaderStyles.container}>
      <div className={PlaylistHeaderStyles["img-container"]}>
        <img src={img} alt="Poster" />
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
            <button className="btn btn--green btn--circle">Play</button>
            <button className="btn-round margin-left">
              <IoMdHeartEmpty />
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
