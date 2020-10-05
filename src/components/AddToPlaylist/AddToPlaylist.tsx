import React from "react";
import AddTrackToPlaylist from "./AddToPlaylist.module.css";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import { addTracksToPlaylist } from "../../store/actions/playlist";

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

type Props = ReduxProps & { trackUri: string };

const AddToPlaylist: React.FC<Props> = ({
  playlists,
  trackUri,
  addTracksToPlaylist,
}) => {
  return (
    <div className={AddTrackToPlaylist.container}>
      <h2>Add to playlist</h2>
      <div className={AddTrackToPlaylist.cards}>
        {playlists.map((playlist) => {
          return (
            <div
              onClick={() => addTracksToPlaylist(trackUri, playlist.id)}
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
