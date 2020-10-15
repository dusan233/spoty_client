import React, { useEffect } from 'react';
import CategoriesStyles from "./Categories.module.css";
import { RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { getCategoryPlaylists } from '../../store/actions/categories';
import { RootState } from '../../store/reducers';
import Spinner from '../Spinner/Spinner';

const mapStateToProps = (state: RootState) => ({
    loading: state.categories.loading,
    playlists: state.categories.categoryPlaylists,
    total: state.categories.total
})
const mapDispatchToProps = {
    getCategoryPlaylists
}
const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type Params = {
    categoryId: string
}

type Props = RouteComponentProps<Params> & ReduxProps

const Category: React.FC<Props> = ({ match, loading, getCategoryPlaylists }) => {

    useEffect(() => {
        getCategoryPlaylists(match.params.categoryId)
    }, [getCategoryPlaylists, match.params.categoryId])

    return (

        <div className={CategoriesStyles.container}>
            {loading ? (
                <div className="loader-container">
                    <Spinner />
                </div>
            ) :
                <React.Fragment>
                    <h1>Playlists for {match.params.categoryId} category</h1>
                </React.Fragment>
            }</div>

    )
}

export default connector(Category);
