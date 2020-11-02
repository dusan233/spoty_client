import React, { useEffect, useState } from "react";
import ArtistStyles from "./Artist.module.css";
import { RouteComponentProps } from "react-router-dom";
import { batch, connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import { getArtist, setArtistLoading } from "../../store/actions/artist";
import {
  saveRemoveTracksForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
  followUnfollowArtistForCurrentUser,
  checkCurrentUserSavedAlbums,
  setAlbumLikes,
} from "../../store/actions/user";
import { fetchArtistAlbums, setMoreAlbums } from "../../store/actions/artist";
import { setPlaying, playAlbumSongs, playArtistSongs } from '../../store/actions/music';
import Spinner from "../Spinner/Spinner";
import ArtistHeader from "./ArtistHeader";
import ClassicTab from "../Tabs/ClassicTab";
import ClassicTabStyles from "../Tabs/ClassicTab.module.css";
import Track from "../Track/Track";
import TrackHeader from "../Track/TrackHeader";
import ArtistCard from "../Card/ArtistSearch";
import InfiniteVirtualizedSimple from "../InfiniteVirtualizedList/InfiniteVirtualizedSimple";
import SearchPlaylistCard from "../Card/SearchPlaylist";

const mapStateToProps = (state: RootState) => ({
  loading: state.artist.loading,
  name: state.artist.name,
  followers: state.artist.followers,
  image: state.artist.image,
  trackLikes: state.user.trackLikes,
  topTracks: state.artist.topTracks,
  artists: state.artist.artists,
  artistFollow: state.user.artistsLikes,
  albums: state.artist.albums,
  albumsTotal: state.artist.albumsTotal,
  albumLikes: state.user.albumLikes,
  accessToken: state.auth.accessToken,
  errorMsg: state.error.errorMsg,
  subError: state.error.subMsg,
  isPlaying: state.music.playing,
  currentPlayingList: state.music.currentListId,
  currentPlayingSongIndex: state.music.currentSongIndex
});
const mapDispatchToProps = {
  getArtist,
  saveRemoveTracksForCurrentUser,
  followUnfollowArtistForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
  setArtistLoading,
  setMoreAlbums,
  setAlbumLikes,
  setPlaying,
  playAlbumSongs,
  playArtistSongs
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
  followUnfollowArtistForCurrentUser,
  saveRemoveAlbumsForCurrentUser,
  setArtistLoading,
  setMoreAlbums,
  setAlbumLikes,
  setPlaying,
  playAlbumSongs,
  playArtistSongs,
  isPlaying,
  currentPlayingList,
  currentPlayingSongIndex,
  match,
  name,
  followers,
  image,
  loading,
  trackLikes,
  topTracks,
  artists,
  artistFollow,
  albums,
  albumsTotal,
  albumLikes,
  accessToken,
  errorMsg,
  subError,
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

  const loadMoreAlbums = () => {
    return fetchArtistAlbums(
      match.params.artistId,
      accessToken,
      "single,album",
      albums.length,
      20
    )
      .then((res) => {
        let albumIds = "";
        res.data.items.slice(0, 50).forEach((album) => {
          if (albumIds === " ") {
            albumIds += album.id;
          } else {
            albumIds += "," + album.id;
          }
        });
        return checkCurrentUserSavedAlbums(albumIds, accessToken).then(
          (savedRes) => {
            batch(() => {
              setMoreAlbums(res.data.items);
              setAlbumLikes(savedRes.data, "add");
            });
          }
        );
      })
      .catch((err) => console.log(err));
  };

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
      ) : errorMsg ? (
        <div className="error-container">
          <div>
            <h1 className="error-heading">{errorMsg}</h1>
            <h3 className="error-text">{subError}</h3>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <ArtistHeader
            artistId={match.params.artistId}
            followed={artistFollow[0]}
            name={name}
            followers={followers}
            image={image}
            followArtist={followUnfollowArtistForCurrentUser}
          />
          <div style={{ padding: "35px" }}>
            <ClassicTab renderLinks={renderLinks} />
            {active === 0 ? (
              <React.Fragment>
                <h1>Popular</h1>
                <div style={{ marginBottom: "80px" }}>
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
                        preview_url={track.preview_url}
                        currentPlayingSongIndex={currentPlayingSongIndex}
                        trackId={track.id}
                        type="artist"
                        saveTrack={saveRemoveTracksForCurrentUser}
                        playPause={setPlaying}
                        artistId={match.params.artistId}
                        listId={match.params.artistId}
                        album={track.album.name}
                        popularity={track.popularity}
                        key={track.id + i}
                        isPlaying={isPlaying}
                        currentPlayingListId={currentPlayingList}
                        liked={liked}
                        albumId={track.album.id}
                        uri={track.uri}
                        playPlaylist={playArtistSongs}
                      />
                    );
                  })}
                </div>
                <h1>Albums</h1>
                <div className="overflow-fix">
                  <InfiniteVirtualizedSimple
                    items={albums}
                    totalItems={albumsTotal}
                    height={480}
                    rowHeight={85}
                    loadMoreItems={loadMoreAlbums}
                    renderRow={({ key, index, style }: any) => {
                      const item = albums[index];

                      const liked = albumLikes[index];
                      if (!albums[index]) {
                        return (
                          <div
                            style={{ ...style }}
                            key={key}
                            className="loader-container"
                          >
                            <Spinner />
                          </div>
                        );
                      } else {
                        return (
                          <SearchPlaylistCard
                            img={item.images[0] && item.images[0].url}
                            description={item.artists[0].name}
                            name={item.name}
                            itemId={item.id}
                            index={index}
                            style={style}
                            userId={item.artists[0].id}
                            key={item.id + index}
                            totalTracks={item.total_tracks}
                            type="album"
                            liked={liked}
                            saveItem={saveRemoveAlbumsForCurrentUser}
                            currentPlayingList={currentPlayingList}
                            isPlaying={isPlaying}
                            playListSongs={playAlbumSongs}
                            playPause={setPlaying}
                          />
                        );
                      }
                    }}
                  />
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {artists.map((artist, i) => {
                  return (
                    <ArtistCard
                      img={artist.images[0].url}
                      name={artist.name}
                      genres={artist.genres}
                      artistId={artist.id}
                      key={artist.id + i}
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
