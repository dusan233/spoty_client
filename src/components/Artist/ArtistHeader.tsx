import React from "react";
import ArtistStyles from "./Artist.module.css";

interface Props {
  name: string;
  image: string;
  followers: number;
  followed: boolean;
  artistId: string | undefined;
  followArtist: (artistId: string | undefined, action: string) => Promise<void>;
}

const ArtistHeader: React.FC<Props> = ({
  name,
  image,
  followers,
  followed,
  artistId,
  followArtist,
}) => {
  const followUnfollowArtist = () => {
    if (followed) {
      followArtist(artistId, "remove");
    } else {
      followArtist(artistId, "save");
    }
  };

  return (
    <div className={ArtistStyles.header}>
      <div
        className={`${ArtistStyles["header__image-cotainer"]}`}
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className={ArtistStyles.text}>
        <h1 className={ArtistStyles.header__heading}>{name}</h1>
        <div className={ArtistStyles.header__followers}>
          {followers!.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          followers
        </div>
        <div className="margin-top-l">
          <button
            onClick={followUnfollowArtist}
            className="btn btn--green btn--circle"
          >
            {followed ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;
