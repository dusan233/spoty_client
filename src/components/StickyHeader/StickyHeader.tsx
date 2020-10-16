import React, { useState } from "react";
import StickyHeaderStyles from "./StickyHeader.module.css";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Dropdown from "../Dropdown/Dropdown";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { FaEdit, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import Modal from "react-modal";
import CreatePlaylist from "../CreatePlaylist/CreatePlaylist";

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
    action: string,
    name: string
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

Modal.setAppElement("#modal");

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
  const [modalIsOpen, setModal] = useState(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const saveRemovePlaylist = () => {
    const action = liked ? "remove" : "save";
    if (playlistId) {
      savePlaylist(playlistId, 0, action, title);
    }
  };
  return (
    <div className={`${StickyHeaderStyles["sticky-header-wrap"]}`}>
      <Modal
        className="Modal"
        overlayClassName="Overlay"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        closeTimeoutMS={400}
      >
        <CreatePlaylist edit={true} closeModal={closeModal} />
      </Modal>
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
            dangerouslySetInnerHTML={{ __html: `By ${owner} - ${description}` }}
          ></div>
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
                    ? "btn-round--liked margin-left margin-right"
                    : "btn-round margin-left margin-right"
                }
                variants={controllsVariants}
              >
                {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
              </motion.button>
            )}

            <Dropdown>
              <motion.button
                className="btn-round"
                variants={controllsVariants}
              >
                <BsThreeDots />
              </motion.button>
              <div
                className={`${DropdownStyles["dropdown--playlist"]} ${DropdownStyles.dropdown}`}
              >
                <ul>
                  {userId === ownerId ? (
                    <li>
                      <div onClick={openModal} className={DropdownStyles.link}>
                        <FaEdit />
                        Edit Playlist
                      </div>
                    </li>
                  ) : (
                    <li>
                      <div
                        onClick={saveRemovePlaylist}
                        className={DropdownStyles.link}
                      >
                        <FaHeart />
                        {liked ? "Remove from library" : "Save to library"}
                      </div>
                    </li>
                  )}
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
