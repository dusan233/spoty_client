import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./Home/Home";
import NotFound from "./NotFound";
import Sidebar from "./Sidebar/Sidebar";
import Playlist from "./Playlist/Playlist";
import Album from "./Album/Album";
import Searchbar from "./Searchbar/Searchbar";
import SearchResult from "./SearchResult/SearchResult";
import { RouteComponentProps } from "react-router-dom";

const Main = () => {
  return (
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
  );
};

export default Main;
