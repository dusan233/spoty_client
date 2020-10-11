import React from "react";
import CardStyles from "./Card.module.css";
import { Link } from "react-router-dom";
import NoImage from "../../assets/264x264-000000-80-0-0.jpg";
import { BsPlayFill, BsThreeDots } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiPlayListAddLine, RiPlayListLine } from "react-icons/ri";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Dropdown from "../Dropdown/Dropdown";
import useSelected from "../../hooks/useSelected";

interface IProps {
  img: string | undefined;
  name: string;
  description: string | null;
  itemId: string;
  index: number;
  style?: any;
  totalTracks: number;
  type: string;
  liked: boolean;
  userId: string;
  saveItem: (
    albumIds: string,
    index: number,
    action: string,
    name?: string
  ) => Promise<void>;
}
const SearchPlaylist: React.FC<IProps> = React.memo(
  ({
    img,
    name,
    description,
    itemId,
    index,
    style,
    totalTracks,
    type,
    liked,
    userId,
    saveItem,
  }) => {
    const [selected, rowRef] = useSelected();

    const saveItemUser = () => {
      const action = liked ? "remove" : "save";
      if (type === "playlist") {
        saveItem(itemId, index, action, name);
      } else {
        saveItem(itemId, index, action);
      }
    };

    return (
      <div
        ref={rowRef}
        style={{ ...style, background: selected && "#ffffff29" }}
        className={`${CardStyles["search-card"]}`}
      >
        <div className={`${CardStyles["search-card__action"]}`}>
          <button
            className={` ${
              selected
                ? CardStyles["search-btn--selected"]
                : CardStyles["search-btn"]
            }`}
          >
            <BsPlayFill />
          </button>
          {index + 1}
        </div>
        <img
          alt="Playlist cover "
          src={img || NoImage}
          className={`${CardStyles["search-card__img"]}`}
        ></img>
        <div className={`${CardStyles["search-card__info"]}`}>
          <div>
            <Link
              to={`/${type === "playlist" ? "playlist" : "album"}/${itemId}`}
              className={`${CardStyles["search-card__name"]}`}
            >
              {name}
            </Link>
            {type === "playlist" ? (
              <div className={`${CardStyles["search-card__desc"]}`}>
                {description}
              </div>
            ) : (
              <Link
                to={`/artist/${userId}`}
                className={`${CardStyles["search-card__desc"]}`}
              >
                {description}
              </Link>
            )}
            <div className={`${CardStyles["search-card__songs"]}`}>
              {totalTracks > 1 ? totalTracks + " songs" : totalTracks + " song"}
            </div>
          </div>
        </div>
        <div className={`${CardStyles["search-card__options"]}`}>
          <div
            onClick={saveItemUser}
            className={` ${
              selected
                ? liked
                  ? CardStyles["search-card__like--liked"]
                  : CardStyles["search-card__like--selected"]
                : liked
                ? CardStyles["search-card__like--liked"]
                : CardStyles["search-card__like"]
            }`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </div>
          <div>
            <Dropdown>
              <div
                className={`  ${
                  selected
                    ? CardStyles["search-card__dots--selected"]
                    : CardStyles["search-card__dots"]
                }`}
              >
                <BsThreeDots />
              </div>
              <div className={DropdownStyles.dropdown}>
                <ul>
                  <li>
                    <div onClick={saveItemUser} className={DropdownStyles.link}>
                      <FaHeart />
                      {liked ? "Remove from library" : "Save to library"}
                    </div>
                  </li>

                  {type === "album" && totalTracks <= 50 && (
                    <li>
                      <div className={DropdownStyles.link}>
                        <RiPlayListLine />
                        Add to Queue
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </Dropdown>
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

export default SearchPlaylist;
