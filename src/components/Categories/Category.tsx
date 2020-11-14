import React, { useEffect, useRef } from 'react';
import CategoriesStyles from "./Categories.module.css";
import { RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { getCategoryPlaylists, fetchCategoryPlaylists, setCategoryPlaylists, setCategLoading } from '../../store/actions/categories';
import {saveRemovePlaylistForCurrentUser} from '../../store/actions/user';
import { RootState } from '../../store/reducers';
import Spinner from '../Spinner/Spinner';
import InfiniteVirtualizedList from '../InfiniteVirtualizedList/InfiniteVirtualizedList';
import SearchPlaylistCard from '../Card/SearchPlaylist';
import {setError} from '../../store/actions/error';
import { setPlaying, playPlaylistSongs } from '../../store/actions/music';

const mapStateToProps = (state: RootState) => ({
    loading: state.categories.loading,
    playlists: state.categories.categoryPlaylists,
    total: state.categories.total,
    playlistLikes: state.user.playlistLikes,
    accessToken: state.auth.accessToken,
    errorMsg: state.error.errorMsg,
    subMsg: state.error.subMsg,
    isPlaying: state.music.playing,
    currentPlayingList: state.music.currentListId,
})
const mapDispatchToProps = {
    getCategoryPlaylists,
    saveRemovePlaylistForCurrentUser,
    setCategoryPlaylists,
    setCategLoading,
    setError,
    setPlaying,
    playPlaylistSongs
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type Params = {
    categoryId: string
}

type Props = RouteComponentProps<Params> & ReduxProps

const Category: React.FC<Props> = ({ match, loading, isPlaying, currentPlayingList, accessToken, playPlaylistSongs, setError, setPlaying, getCategoryPlaylists, setCategoryPlaylists, saveRemovePlaylistForCurrentUser, playlists, total, playlistLikes, errorMsg, subMsg }) => {
    let containerEl = useRef<HTMLDivElement>(null);
    useEffect(() => {
        getCategoryPlaylists(match.params.categoryId);
        return () => {
            setCategLoading(true);
            setError("", "");
          };
    }, [getCategoryPlaylists, setError,  match.params.categoryId])


    const loadMorePlaylists = () => {
       return fetchCategoryPlaylists(match.params.categoryId, playlists.length, accessToken )
       .then(res => {
        setCategoryPlaylists(res.data.playlists.items, res.data.playlists.total, "add")
       }).catch(err => console.log(err))
    }


    if (errorMsg) {
        return (
          <div className="error-container">
            <div>
              <h1 className="error-heading">{errorMsg}</h1>
              <h3 className="error-text">{subMsg}</h3>
            </div>
          </div>
        );
      }

    return (

        <div ref={containerEl} className={CategoriesStyles.container}>
            {loading ? (
                <div className="loader-container">
                    <Spinner />
                </div>
            ) :
                <React.Fragment>
                    <h1>Playlists for {match.params.categoryId} category</h1>
                    {containerEl.current ?
                      <InfiniteVirtualizedList
                      rowHeight={85}
                      items={playlists}
                      totalItems={total}
                      type="playlists"
                      containerEl={containerEl}
                      loadMoreItems={loadMorePlaylists}
                      renderRow={({ key, index, style }: any) => {
                          const item = playlists[index];
                          const liked = playlistLikes[index];
                          if (!playlists[index]) {
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
                                img={
                                  item.images[0] && item.images[0].url
                                }
                                description={item.owner.display_name}
                                name={item.name}
                                itemId={item.id}
                                index={index}
                                style={style}
                                userId={item.owner.id}
                                key={item.id + index}
                                totalTracks={item.tracks.total}
                                type="playlist"
                                liked={liked}
                                currentPlayingList={currentPlayingList}
                                isPlaying={isPlaying}
                                playListSongs={playPlaylistSongs}
                                saveItem={saveRemovePlaylistForCurrentUser}
                                playPause={setPlaying}
                              />
                            );
                          }
                        }}
                  />
                    : null}

                </React.Fragment>
            }</div>

    )
}

export default connector(Category);
