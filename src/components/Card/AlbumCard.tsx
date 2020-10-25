import React from "react";
import CardStyles from "./Card.module.css";
import { ArtistSimplified } from "../../store/types/artist";
import { Link } from "react-router-dom";

import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { ActionCreator } from "redux";
import { SetPlaying } from "../../store/types/music";

interface IProps {
  img: string | undefined;
  name: string;
  artists: ArtistSimplified[];
  albumId: string;
  currentPlayingList: string;
  isPlaying: boolean;
  playPause: ActionCreator<SetPlaying>
  playSongs: (albumId: string, songIndex: number, endIndex: number) => Promise<void>
}

const AlbumCard: React.FC<IProps> = ({ name, img, artists, albumId, currentPlayingList, isPlaying,playPause, playSongs }) => {
  const renderArtists = () => {
    let artistsString = "";
    artists.forEach((artist) => {
      artistsString += " " + artist.name;
    });
    return artistsString;
  };


  const playSong = () => {
    if(currentPlayingList === albumId) {
      playPause(!isPlaying);
    }else {
      playSongs(albumId, 0, 50);
    }
  }

  return (
    <div className={CardStyles.card}>
      <div className={CardStyles.card__image_container}>
        <div className={CardStyles.card__image_container_placeholder}>
          <img
            className={CardStyles.card__image}
            src={img}
            alt="Playlist poster"
          />
        </div>
        <div className={CardStyles.card__overlay}>
          <div className={CardStyles.card__overlay__content}>
            <button onClick={playSong} className={`${CardStyles.btn} ${CardStyles["btn--play"]}`}>
            {isPlaying && currentPlayingList === albumId ? <BsPauseFill /> : <BsPlayFill />} 
            </button>
          </div>
        </div>
      </div>
      <div className={CardStyles.card__info}>
        <Link to={`/album/${albumId}`} className={CardStyles.card__name}>
          {name}
        </Link>
        <div className={CardStyles.card__owner}>{renderArtists()}</div>
      </div>
    </div>
  );
};

export default AlbumCard;
