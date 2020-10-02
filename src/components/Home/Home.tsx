import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { getHomeData, setHomeLoading } from "../../store/actions/home";
import { RootState } from "../../store/reducers/index";
import { setError } from "../../store/actions/error";

import HomeStyles from "./Home.module.css";
import Spinner from "../Spinner/Spinner";
import PlaylistCard from "../Card/PlaylistCard";
import AlbumCard from "../Card/AlbumCard";

const mapStateToProps = (state: RootState) => ({
  featuredPlaylists: state.home.featuredPlaylistsPrew,
  newReleases: state.home.newReleases,
  loading: state.home.loading,
  error: state.error.errorMsg,
  subErrorMsg: state.error.subMsg,
});
const mapDispatchToProps = {
  getHomeData,
  setHomeLoading,
  setError,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps;

const Home: React.FC<Props> = ({
  getHomeData,
  setHomeLoading,
  setError,
  loading,
  featuredPlaylists,
  newReleases,
  error,
  subErrorMsg,
}) => {
  useEffect(() => {
    getHomeData();
    return () => {
      setHomeLoading(true);
      setError("", "");
    };
  }, [getHomeData, setHomeLoading, setError]);

  if (error) {
    return (
      <div className="error-container">
        <div>
          <h1 className="error-heading">{error}</h1>
          <h3 className="error-text">{subErrorMsg}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={HomeStyles.home}>
      {loading ? (
        <div className="loader-container">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <div className={HomeStyles.home__list_heading}>
            <h1>Featured playlists</h1>
            <div className="home-card-list">
              {featuredPlaylists.map((playlist) => {
                return (
                  <PlaylistCard
                    key={playlist.id}
                    img={playlist.images[0].url || undefined}
                    name={playlist.name}
                    description={playlist.description}
                    playlistId={playlist.id}
                  />
                );
              })}
            </div>
          </div>

          <div className={HomeStyles.home__list_heading}>
            <h1>New Releases</h1>
            <div className="home-card-list">
              {newReleases.map((album) => {
                return (
                  <AlbumCard
                    key={album.id}
                    img={album.images[1].url || undefined}
                    name={album.name}
                    artists={album.artists}
                    albumId={album.id}
                  />
                );
              })}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default connector(Home);
