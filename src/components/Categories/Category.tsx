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

const mapStateToProps = (state: RootState) => ({
    loading: state.categories.loading,
    playlists: state.categories.categoryPlaylists,
    total: state.categories.total,
    playlistLikes: state.user.playlistLikes,
    accessToken: state.auth.accessToken
})
const mapDispatchToProps = {
    getCategoryPlaylists,
    saveRemovePlaylistForCurrentUser,
    setCategoryPlaylists,
    setCategLoading
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type Params = {
    categoryId: string
}

type Props = RouteComponentProps<Params> & ReduxProps

const Category: React.FC<Props> = ({ match, loading, accessToken, getCategoryPlaylists, setCategoryPlaylists, saveRemovePlaylistForCurrentUser, playlists, total, playlistLikes }) => {
    let containerEl = useRef<HTMLDivElement>(null);
    useEffect(() => {
        getCategoryPlaylists(match.params.categoryId);
        return () => {
            setCategLoading(true);
          };
    }, [getCategoryPlaylists, match.params.categoryId])


    const loadMorePlaylists = () => {
       return fetchCategoryPlaylists(match.params.categoryId, playlists.length, accessToken )
       .then(res => {
        setCategoryPlaylists(res.data.playlists.items, res.data.playlists.total, "add")
       }).catch(err => console.log(err))
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
                                  saveItem={saveRemovePlaylistForCurrentUser}
                                />
                              );
                            }
                          }}
                    />

                </React.Fragment>
            }</div>

    )
}

export default connector(Category);
