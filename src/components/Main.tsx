import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { getCurrentUserData } from "../store/actions/user";

import Home from "./Home/Home";
import NotFound from "./NotFound";
import Sidebar from "./Sidebar/Sidebar";
import Playlist from "./Playlist/Playlist";
import Album from "./Album/Album";
import Searchbar from "./Searchbar/Searchbar";
import SearchResult from "./SearchResult/SearchResult";
import MusicLibrary from "./MusicLibrary/MusicLibrary";
import Artist from "./Artist/Artist";
import Categories from "./Categories/Categories";
import Category from './Categories/Category';
import { RootState } from "../store/reducers";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const mapStateToProps = (state: RootState) => ({
  isAuth: state.auth.accessToken
})
const mapDispatchToProps = {
  getCurrentUserData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const Main: React.FC<Props> = ({ getCurrentUserData, isAuth }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentUserData().then((res) => setReady(true));
  }, [getCurrentUserData]);
  return ready ? (
    <div>
      <div className="root">
        <div className="root__wrap">
          <div className="root__sidebar">
            <Sidebar />
          </div>
          <div className="root__content-container">
            <div className="root__searchbar">
              <Searchbar />
            </div>
            <div className="root__content">
              <Switch>
                <ProtectedRoute path="/" exact isAuth={!!isAuth} component={Home} />
                <ProtectedRoute
                  path="/playlist/:playlistId"
                  exact
                  isAuth={!!isAuth}
                  component={Playlist}
                />
                <ProtectedRoute path="/album/:albumId" exact component={Album} isAuth={!!isAuth} />
                <ProtectedRoute path="/library/:term" exact component={MusicLibrary} isAuth={!!isAuth} />
                <ProtectedRoute path="/artist/:artistId" exact component={Artist} isAuth={!!isAuth} />
                <ProtectedRoute path="/categories" exact component={Categories} isAuth={!!isAuth} />
                <ProtectedRoute path="/category/:categoryId" exact component={Category} isAuth={!!isAuth} />
                <ProtectedRoute
                  path="/search/:type/:searchTerm"
                  exact
                  component={SearchResult}
                  isAuth={!!isAuth}
                />
                <ProtectedRoute path="*" component={NotFound} isAuth={!!isAuth} />
              </Switch>
            </div>
          </div>
        </div>
        <div className="root__audio-player"></div>
      </div>
    </div>
  ) : (
    <div className="preload"></div>
  );
};

export default connector(Main);
