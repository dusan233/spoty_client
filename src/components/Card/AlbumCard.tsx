import React from "react";
import CardStyles from "./Card.module.css";
import { ArtistSimplified } from "../../store/types/artist";
import { Link } from "react-router-dom";

import { FaRegHeart } from "react-icons/fa";
import { BsThreeDots, BsPlayFill } from "react-icons/bs";
import Dropdown from "../Dropdown/Dropdown";
import DropdownStyles from "../Dropdown/Dropdown.module.css";

interface IProps {
  img: string | undefined;
  name: string;
  artists: ArtistSimplified[];
  albumId: string;
}

const AlbumCard: React.FC<IProps> = ({ name, img, artists, albumId }) => {
  const renderArtists = () => {
    let artistsString = "";
    artists.forEach((artist) => {
      artistsString += " " + artist.name;
    });
    return artistsString;
  };

  return (
    <div className={CardStyles.card}>
      <div className={CardStyles.card__image_container}>
        <img
          className={CardStyles.card__image}
          src={img}
          alt="Playlist poster"
        />
        <div className={CardStyles.card__overlay}>
          <div className={CardStyles.card__overlay__content}>
            <button className={`${CardStyles.btn} ${CardStyles["btn--side"]}`}>
              <FaRegHeart />
            </button>
            <button className={`${CardStyles.btn} ${CardStyles["btn--play"]}`}>
              <BsPlayFill />
            </button>
            <Dropdown>
              <button
                className={`${CardStyles.btn} ${CardStyles["btn--side"]}`}
              >
                <BsThreeDots />
              </button>
              <div
                className={`${DropdownStyles.dropdown} ${DropdownStyles["dropdown--card"]}`}
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
      <div className={CardStyles.card__info}>
        <Link to={`/album/${albumId}`} className={CardStyles.card__name}>
          {name}
        </Link>
        <div className={CardStyles.card__owner}>{renderArtists()}</div>
      </div>
    </div>
  );
};

export default AlbumCard;
