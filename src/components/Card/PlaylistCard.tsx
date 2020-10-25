import React from "react";
import CardStyles from "./Card.module.css";
import { Link } from "react-router-dom";

import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { ActionCreator } from "redux";
import { SetPlaying } from "../../store/types/music";

interface IProps {
  img: string | undefined;
  name: string;
  description: string | null;
  playlistId: string;
  currentPlayingList: string;
  isPlaying: boolean;
  playPause: ActionCreator<SetPlaying>
  playSongs: (playlistId: string, songIndex: number, endIndex: number) => Promise<void>
}

const PlaylistCard: React.FC<IProps> = React.memo(
  ({ name, img, description, playlistId, currentPlayingList, isPlaying, playPause, playSongs }) => {

    const playSong = () => {
      if(currentPlayingList === playlistId) {
        playPause(!isPlaying);
      }else {
        playSongs(playlistId, 0, 50);
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
              <button
              onClick={playSong}
                className={`${CardStyles.btn} ${CardStyles["btn--play"]}`}
              >
                 {isPlaying && currentPlayingList === playlistId ? <BsPauseFill /> : <BsPlayFill />} 
              </button>
            </div>
          </div>
        </div>
        <div className={CardStyles.card__info}>
          <Link
            to={`/playlist/${playlistId}`}
            className={CardStyles.card__name}
          >
            {name}
          </Link>
          <div
            dangerouslySetInnerHTML={{ __html: description ? description : "" }}
            className={CardStyles.card__owner}
          ></div>
        </div>
      </div>
    );
  },
  function areEqual(prevProps, nextProps) {
    let isEqual = true;

    if (JSON.stringify(prevProps) !== JSON.stringify(nextProps)) {
      isEqual = false;
    }

    return isEqual;
  }
);

export default PlaylistCard;
