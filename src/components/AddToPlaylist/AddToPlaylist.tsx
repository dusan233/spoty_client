import React from "react";
import AddTrackToPlaylist from "./AddToPlaylist.module.css";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import { addTracksToPlaylist } from "../../store/actions/playlist";
import { RiCloseLine } from "react-icons/ri";

const mapStateToProps = (state: RootState) => ({
  playlists: state.library.playlists.filter(
    (playlist) => playlist.owner.id === state.user.userId
  ),
});

const mapDispatchToProps = {
  addTracksToPlaylist,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & { trackUri: string; closeModal: () => void };

const AddToPlaylist: React.FC<Props> = ({
  playlists,
  trackUri,
  addTracksToPlaylist,
  closeModal,
}) => {
  return (
    <div className={AddTrackToPlaylist.container}>
      <div className={`${AddTrackToPlaylist["icon-container"]}`}>
        <RiCloseLine onClick={closeModal} />
      </div>
      <h2>Add to playlist</h2>
      <div className={AddTrackToPlaylist.cards}>
        {playlists.map((playlist, i) => {
          return (
            <div
              key={i}
              onClick={() =>
                addTracksToPlaylist(trackUri, playlist.id).then((res) => {
                  closeModal();
                })
              }
              className={AddTrackToPlaylist.card}
            >
              {playlist.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default connector(AddToPlaylist);
