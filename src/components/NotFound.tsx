import React from "react";
import logo from "../assets/Spotify_Logo_CMYK_White.png";

const NotFound = () => {
  return (
    <div className="page-not-found">
      <div className="wrap">
        <img src={logo} alt="" />
        <h1>Sorry, couldn't find that.</h1>
      </div>
    </div>
  );
};

export default NotFound;
