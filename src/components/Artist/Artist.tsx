import React, { useEffect, useState } from "react";
import ArtistStyles from "./Artist.module.css";
import { RouteComponentProps } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import { getArtist, setArtistLoading } from "../../store/actions/artist";
import { saveRemoveTracksForCurrentUser } from "../../store/actions/user";

import Spinner from "../Spinner/Spinner";
import ArtistHeader from "./ArtistHeader";
import ClassicTab from "../Tabs/ClassicTab";
import ClassicTabStyles from "../Tabs/ClassicTab.module.css";
import Track from "../Track/Track";
import TrackHeader from "../Track/TrackHeader";
import ArtistCard from "../Card/ArtistSearch";

const mapStateToProps = (state: RootState) => ({
  loading: state.artist.loading,
  name: state.artist.name,
  followers: state.artist.followers,
  image: state.artist.image,
  trackLikes: state.user.trackLikes,
  topTracks: state.artist.topTracks,
  artists: state.artist.artists,
  artistFollow: state.user.artistsLikes,
});
const mapDispatchToProps = {
  getArtist,
  saveRemoveTracksForCurrentUser,
  setArtistLoading,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Params = {
  artistId?: string;
};

type ReduxProps = ConnectedProps<typeof connector>;

type Props = RouteComponentProps<Params> & ReduxProps;

const Artist: React.FC<Props> = ({
  getArtist,
  saveRemoveTracksForCurrentUser,
  setArtistLoading,
  match,
  name,
  followers,
  image,
  loading,
  trackLikes,
  topTracks,
  artists,
  artistFollow,
}) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    getArtist(match.params.artistId);
    setActive(0);
  }, [getArtist, match.params.artistId]);

  useEffect(() => {
    return () => {
      setArtistLoading(true);
    };
  }, [setArtistLoading]);

  const renderLinks = () => {
    return (
      <React.Fragment>
        <li>
          <div
            onClick={() => setActive(0)}
            className={`${
              active === 0
                ? ClassicTabStyles["item--active"] +
                  " " +
                  ClassicTabStyles["item"]
                : ClassicTabStyles["item"]
            }`}
          >
            Overview
          </div>
        </li>
        <li>
          <div
            onClick={() => setActive(1)}
            className={`${
              active === 1
                ? ClassicTabStyles["item--active"] +
                  " " +
                  ClassicTabStyles["item"]
                : ClassicTabStyles["item"]
            }`}
          >
            Fans Also Like
          </div>
        </li>
      </React.Fragment>
    );
  };

  return (
    <div className={ArtistStyles.container}>
      {loading ? (
        <div className="loader-container">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <ArtistHeader
            followed={artistFollow[0]}
            name={name}
            followers={followers}
            image={image}
          />
          <div style={{ padding: "35px" }}>
            <ClassicTab renderLinks={renderLinks} />
            {active === 0 ? (
              <React.Fragment>
                <h1>Popular</h1>
                <TrackHeader />
                {topTracks.map((track, i) => {
                  const liked = trackLikes[i];
                  return (
                    <Track
                      title={track.name}
                      artists={track.artists}
                      index={i}
                      duration={track.duration_ms}
                      explicit={track.explicit}
                      trackId={track.id}
                      type="playlist"
                      saveTrack={saveRemoveTracksForCurrentUser}
                      album={track.album.name}
                      popularity={track.popularity}
                      key={track.id}
                      liked={liked}
                      albumId={track.album.id}
                    />
                  );
                })}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {artists.map((artist) => {
                  return (
                    <ArtistCard
                      img={artist.images[0].url}
                      name={artist.name}
                      genres={artist.genres}
                      artistId={artist.id}
                      key={artist.id}
                    />
                  );
                })}
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default connector(Artist);
