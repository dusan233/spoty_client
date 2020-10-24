import React, {useCallback} from 'react';
import NowPlayingStyles from './NowPlaying.module.css';
import {Link} from 'react-router-dom';
import { ArtistSimplified } from '../../store/types/artist';
import { FaRegHeart } from 'react-icons/fa';

type Props = {
    img: string | undefined,
    title: string,
    albumId: string,
    artists: ArtistSimplified[]
}

const SongInfo: React.FC<Props> = ({img, title, albumId, artists}) => {

    const getArtists = useCallback(() => {
        let artistsString: any[] = [];
        if (!artists) {
          return "";
        }
        artists.forEach((artist, i) => {
          if (i === artists!.length - 1) {
            artistsString.push(
              <React.Fragment key={artist.id}>
                <Link className={`${NowPlayingStyles["song-info__artist"]}`} title={artist.name} to={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              </React.Fragment>
            );
          } else {
            artistsString.push(
              <React.Fragment key={artist.id}>
                <Link className={`${NowPlayingStyles["song-info__artist"]}`} title={artist.name} to={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>{" "}
                ,{" "}
              </React.Fragment>
            );
          }
        });
        return artistsString;
      }, [artists]);

    return (
        <div className={`${NowPlayingStyles["song-info"]}`}>
            <div className={`${NowPlayingStyles["img-container"]}`}>
                <img src={img} alt=""/>
            </div>
            <div>
                <Link to={`/album/${albumId}`} title={title} className={`${NowPlayingStyles["song-info__title"]}`}>
                    {title}
                </Link>
                <div className={`${NowPlayingStyles["song-info__artists"]}`}>
                    {getArtists()}
                </div>
            </div>
            <button className={`${NowPlayingStyles["extra-controls-button"]} margin-left`}>
                <FaRegHeart />
            </button>
        </div>
    )
}

export default SongInfo
