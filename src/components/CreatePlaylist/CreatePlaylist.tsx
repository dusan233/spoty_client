import React, { ChangeEvent, useState, FormEvent } from "react";
import { RiCloseLine } from "react-icons/ri";
import CreatePlaylistStyles from "./CreatePlaylist.module.css";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import { createPlaylist } from "../../store/actions/user";

const mapStateToProps = (state: RootState) => ({
  loading: state.user.creatingPlaylist,
  playlists: state.library.playlists.filter(
    (playlist) => playlist.owner.id === state.user.userId
  ),
});
const mapDispatchToProps = {
  createPlaylist,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = {
  closeModal: () => void;
} & ReduxProps;

const CreatePlaylist: React.FC<Props> = ({
  closeModal,
  createPlaylist,
  playlists,
  loading,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onChangeInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const createNewPlaylist = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      createPlaylist(`Playlist #${playlists.length + 1}`, description);
    } else {
      createPlaylist(name, description);
    }
  };

  return (
    <div className={CreatePlaylistStyles.container}>
      <div className={`${CreatePlaylistStyles["icon-container"]}`}>
        <RiCloseLine onClick={closeModal} />
      </div>
      <h2>Create Playlist</h2>
      <form onSubmit={createNewPlaylist} className={CreatePlaylistStyles.form}>
        <div className={CreatePlaylistStyles.form__content}>
          <div className={CreatePlaylistStyles.form__inputs}>
            <div className={`${CreatePlaylistStyles["form__input-control"]}`}>
              <label className={CreatePlaylistStyles.form__label}>Name</label>
              <input
                onChange={onChangeInput}
                name="name"
                className={CreatePlaylistStyles.form__input}
                type="text"
                value={name}
                placeholder="Playlist name"
              />
            </div>
            <div className={`${CreatePlaylistStyles["form__input-control"]}`}>
              <label className={CreatePlaylistStyles.form__label}>
                Description
              </label>
              <textarea
                onChange={onChangeInput}
                name="description"
                rows={6}
                value={description}
                className={CreatePlaylistStyles.form__input}
                placeholder="Give your playlist a catchy description"
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading ? true : false}
          className="btn btn--green btn--circle"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default connector(CreatePlaylist);
