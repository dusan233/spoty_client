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

const mapDispatchToProps = {
  getCurrentUserData,
};
const connector = connect(null, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const Main: React.FC<Props> = ({ getCurrentUserData }) => {
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
                <Route path="/" exact component={Home} />
                <Route
                  path="/playlist/:playlistId"
                  exact
                  component={Playlist}
                />
                <Route path="/album/:albumId" exact component={Album} />
                <Route path="/library/:term" exact component={MusicLibrary} />
                <Route path="/artist/:artistId" exact component={Artist} />
                <Route path="/categories" exact component={Categories} />
                <Route path="/category/:categoryId" exact component={Category} />
                <Route
                  path="/search/:type/:searchTerm"
                  exact
                  component={SearchResult}
                />
                <Route path="*" component={NotFound} />
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
