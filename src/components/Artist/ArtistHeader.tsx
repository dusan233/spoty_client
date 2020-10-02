import React from "react";
import ArtistStyles from "./Artist.module.css";

interface Props {
  name: string;
  image: string;
  followers: number;
  followed: boolean;
}

const ArtistHeader: React.FC<Props> = ({
  name,
  image,
  followers,
  followed,
}) => {
  return (
    <div className={ArtistStyles.header}>
      <div className={`${ArtistStyles["header__image-cotainer"]}`}>
        <img src={image} alt="" />
      </div>
      <div className={ArtistStyles.text}>
        <h1 className={ArtistStyles.header__heading}>{name}</h1>
        <div className={ArtistStyles.header__followers}>
          {followers!.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          followers
        </div>
        <div className="margin-top-l">
          <button className="btn btn--green btn--circle">
            {followed ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;
