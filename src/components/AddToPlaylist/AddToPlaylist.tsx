import React from "react";
import AddTrackToPlaylist from "./AddToPlaylist.module.css";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";

const mapStateToProps = (state: RootState) => ({
  playlists: state.library.playlists.filter(
    (playlist) => playlist.owner.id === state.user.userId
  ),
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps;

const AddToPlaylist: React.FC<Props> = ({ playlists }) => {
  return (
    <div className={AddTrackToPlaylist.container}>
      <h2>Add to playlist</h2>
      <div className={AddTrackToPlaylist.cards}>
        {playlists.map((playlist) => {
          return <div className={AddTrackToPlaylist.card}>{playlist.name}</div>;
        })}
      </div>
    </div>
  );
};

export default connector(AddToPlaylist);
