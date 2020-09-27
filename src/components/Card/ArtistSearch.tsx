import React from "react";
import CardStyles from "./Card.module.css";
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import NoImage from "../../assets/noimageartist.jpg";
import useSelected from "../../hooks/useSelected";

interface IProps {
  img: string | undefined;
  name: string;
  genres: string[];
  artistId: string;
  style?: any;
}

const ArtistSearch: React.FC<IProps> = React.memo(
  ({ style, img, name, genres }) => {
    const [selected, rowRef] = useSelected();
    const getGenres = () => {
      return genres.map((genre) => {
        return (
          <div key={genre} className={`${CardStyles["search-card__genre"]}`}>
            {genre}
          </div>
        );
      });
    };

    return (
      <div
        ref={rowRef}
        style={{ ...style, background: selected && "#ffffff29" }}
        className={`${CardStyles["search-card"]}`}
      >
        <div className={`${CardStyles["search-card__img-container"]}`}>
          <div
            className={`${CardStyles["search-card__img-wrap"]}`}
            style={{ backgroundImage: `url(${img || NoImage})` }}
          ></div>
        </div>
        <div className={`${CardStyles["search-card__info"]}`}>
          <div>
            <Link
              to={`/playlist/das12`}
              className={`${CardStyles["search-card__name"]}`}
            >
              {name}
            </Link>
            <div className={`${CardStyles["search-card__genres"]}`}>
              {getGenres()}
            </div>
          </div>
        </div>
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

export default ArtistSearch;
