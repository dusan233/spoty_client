import React from "react";
import { RiCloseLine } from "react-icons/ri";
import CreatePlaylistStyles from "./CreatePlaylist.module.css";
import NoImage from "../../assets/264x264-000000-80-0-0.jpg";

type Props = {
  closeModal: () => void;
};

const CreatePlaylist: React.FC<Props> = ({ closeModal }) => {
  return (
    <div className={CreatePlaylistStyles.container}>
      <div className={`${CreatePlaylistStyles["icon-container"]}`}>
        <RiCloseLine onClick={closeModal} />
      </div>
      <h2>Create Playlist</h2>
      <form className={CreatePlaylistStyles.form}>
        <div className={CreatePlaylistStyles.form__content}>
          <div className={`${CreatePlaylistStyles["form__image-container"]}`}>
            <img src={NoImage} alt="playlist cover" />
          </div>
          <div className={CreatePlaylistStyles.form__inputs}>
            <div className={`${CreatePlaylistStyles["form__input-control"]}`}>
              <label className={CreatePlaylistStyles.form__label}>Name</label>
              <input
                className={CreatePlaylistStyles.form__input}
                type="text"
                placeholder="Playlist name"
              />
            </div>
            <div className={`${CreatePlaylistStyles["form__input-control"]}`}>
              <label className={CreatePlaylistStyles.form__label}>
                Description
              </label>
              <textarea
                rows={6}
                className={CreatePlaylistStyles.form__input}
                placeholder="Give your playlist a catchy description"
              />
            </div>
          </div>
        </div>

        <button className="btn btn--green btn--circle">Create</button>
      </form>
    </div>
  );
};

export default CreatePlaylist;
