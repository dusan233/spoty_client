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
        <div className={CardStyles.card__image_container_placeholder}>
          <img
            className={CardStyles.card__image}
            src={img}
            alt="Playlist poster"
          />
        </div>
        <div className={CardStyles.card__overlay}>
          <div className={CardStyles.card__overlay__content}>
            <button className={`${CardStyles.btn} ${CardStyles["btn--play"]}`}>
              <BsPlayFill />
            </button>
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
