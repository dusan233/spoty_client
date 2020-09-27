import React from "react";
import CardStyles from "./Card.module.css";
import { Link } from "react-router-dom";

import { FaRegHeart } from "react-icons/fa";
import { BsThreeDots, BsPlayFill } from "react-icons/bs";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Dropdown from "../Dropdown/Dropdown";

interface IProps {
  img: string | undefined;
  name: string;
  description: string | null;
  playlistId: string;
  measureImage?: any;
}

const PlaylistCard: React.FC<IProps> = React.memo(
  ({ name, img, description, playlistId, measureImage }) => {
    return (
      <div className={CardStyles.card}>
        <div className={CardStyles.card__image_container}>
          <div className={CardStyles.card__image_container_placeholder}>
            <img
              onLoad={measureImage}
              className={CardStyles.card__image}
              src={img}
              alt="Playlist poster"
            />
          </div>
          <div className={CardStyles.card__overlay}>
            <div className={CardStyles.card__overlay__content}>
              <button
                className={`${CardStyles.btn} ${CardStyles["btn--side"]}`}
              >
                <FaRegHeart />
              </button>
              <button
                className={`${CardStyles.btn} ${CardStyles["btn--play"]}`}
              >
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
          <Link
            to={`/playlist/${playlistId}`}
            className={CardStyles.card__name}
          >
            {name}
          </Link>
          <div
            dangerouslySetInnerHTML={{ __html: description ? description : "" }}
            className={CardStyles.card__owner}
          ></div>
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

export default PlaylistCard;
