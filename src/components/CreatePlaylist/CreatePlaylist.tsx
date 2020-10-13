import React, { ChangeEvent, useState, FormEvent } from "react";
import { RiCloseLine } from "react-icons/ri";
import CreatePlaylistStyles from "./CreatePlaylist.module.css";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import { createPlaylist, editPlaylistDetails } from "../../store/actions/user";

const mapStateToProps = (state: RootState) => ({
  loading: state.user.creatingPlaylist,
  playlists: state.library.playlists.filter(
    (playlist) => playlist.owner.id === state.user.userId
  ),
  playlistName: state.playlist.name,
});
const mapDispatchToProps = {
  createPlaylist,
  editPlaylistDetails,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = {
  closeModal: () => void;
  edit?: boolean;
} & ReduxProps;

const CreatePlaylist: React.FC<Props> = ({
  closeModal,
  createPlaylist,
  editPlaylistDetails,
  playlists,
  loading,
  edit,
  playlistName,
}) => {
  const [name, setName] = useState(edit ? playlistName : "");
  const [description, setDescription] = useState(
    edit ? "playlist description" : ""
  );

  const onChangeInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const createEditPlaylist = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let playlistName = name;
    if (edit) {
      editPlaylistDetails(playlistName, description).then((_) => closeModal());
    } else {
      if (!name) playlistName = `Playlist #${playlists.length + 1}`;
      createPlaylist(playlistName, description).then((_) => {
        closeModal();
      });
    }
  };

  return (
    <div className={CreatePlaylistStyles.container}>
      <div className={`${CreatePlaylistStyles["icon-container"]}`}>
        <RiCloseLine onClick={closeModal} />
      </div>
      <h2>{edit ? "Edit Playlist Details" : "Create Playlist"}</h2>
      <form onSubmit={createEditPlaylist} className={CreatePlaylistStyles.form}>
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
          type="submit"
        >
          {edit ? "Save" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default connector(CreatePlaylist);
