import React, { useState } from "react";
import PlaylistHeaderStyles from "./PlaylistHeader.module.css";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import NoImage from "../../assets/264x264-000000-80-0-0.jpg";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import Dropdown from "../Dropdown/Dropdown";
import { FaHeart, FaEdit } from "react-icons/fa";
import Modal from "react-modal";
import CreatePlaylist from "../CreatePlaylist/CreatePlaylist";

interface PlaylistProps {
  name: string;
  owner: string;
  ownerId: string;
  followers: number;
  img: string | undefined;
  description: string | null;
  totalSongs: number;
  type: string;
  liked: boolean;
  playlistId: string | undefined;
  userId: string;
  savePlaylist: (
    playlistId: string,
    index: number,
    action: string,
    name: string
  ) => Promise<void>;
}

const PlaylistHeader: React.FC<PlaylistProps> = ({
  name,
  owner,
  followers,
  img,
  description,
  totalSongs,
  liked,
  playlistId,
  userId,
  ownerId,
  savePlaylist,
}) => {
  const [modalIsOpen, setModal] = useState(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const saveRemovePlaylist = () => {
    const action = liked ? "remove" : "save";
    if (playlistId) {
      savePlaylist(playlistId, 0, action, name);
    }
  };
  return (
    <div className={PlaylistHeaderStyles.container}>
      <Modal
        className="Modal"
        overlayClassName="Overlay"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        closeTimeoutMS={400}
      >
        <CreatePlaylist edit={true} closeModal={closeModal} />
      </Modal>
      <div className={PlaylistHeaderStyles["img-container"]}>
        <img src={img || NoImage} alt="Poster" />
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
            {totalSongs ? (
              <button className="btn btn--green btn--circle">Play</button>
            ) : null}

            {userId === ownerId ? null : (
              <button
                onClick={saveRemovePlaylist}
                className={
                  liked
                    ? "btn-round--liked margin-left"
                    : "btn-round margin-left"
                }
              >
                {liked ? <IoMdHeart /> : <IoMdHeartEmpty />}
              </button>
            )}

            <Dropdown>
              <button className="btn-round margin-left">
                <BsThreeDots />
              </button>
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
      </div>
    </div>
  );
};

export default PlaylistHeader;
