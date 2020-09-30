import React from "react";
import StickyHeaderStyles from "./StickyHeader.module.css";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Dropdown from "../Dropdown/Dropdown";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Props = {
  img: string | undefined;
  title: string;
  owner: string;
  description: string | null;
  followers: number;
  totalSongs: number;
  playlistId: string | undefined;
  liked: boolean;
  ownerId: string;
  userId: string;
  savePlaylist: (
    playlistId: string,
    index: number,
    action: string
  ) => Promise<void>;
};

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 70,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const controllsVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const StickyHeader: React.FC<Props> = ({
  img,
  title,
  owner,
  description,
  followers,
  ownerId,
  userId,
  totalSongs,
  liked,
  playlistId,
  savePlaylist,
}) => {
  const saveRemovePlaylist = () => {
    const action = liked ? "remove" : "save";
    if (playlistId) {
      savePlaylist(playlistId, 0, action);
    }
  };
  return (
    <div className={`${StickyHeaderStyles["sticky-header-wrap"]}`}>
      <motion.div
        className={`${StickyHeaderStyles["sticky-header"]}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <img
          className={`${StickyHeaderStyles["sticky-header__img"]}`}
          src={img}
          alt=""
        />
        <div className={`${StickyHeaderStyles["sticky-header__content"]}`}>
          <div className={`${StickyHeaderStyles["sticky-header__title"]}`}>
            {title}
          </div>
          <div
            className={`${StickyHeaderStyles["sticky-header__description"]}`}
          >
            By {owner} - {description}
          </div>
          <div>
            {followers!.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            FOLLOWERS
          </div>
          <div className={`${StickyHeaderStyles["sticky-header__controlls"]}`}>
            {totalSongs ? (
              <motion.button
                className="btn btn--green btn--circle"
                variants={controllsVariants}
              >
                Play
              </motion.button>
            ) : null}

            {userId === ownerId ? null : (
              <motion.button
                onClick={saveRemovePlaylist}
                className={
                  liked
                    ? "btn-round--liked margin-left"
                    : "btn-round margin-left"
                }
                variants={controllsVariants}
              >
                {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
              </motion.button>
            )}

            <Dropdown>
              <motion.button
                className="btn-round margin-left"
                variants={controllsVariants}
              >
                <BsThreeDots />
              </motion.button>
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
      </motion.div>
    </div>
  );
};

export default StickyHeader;
