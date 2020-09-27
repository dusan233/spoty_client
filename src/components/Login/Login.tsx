import React, { useEffect } from "react";
import logo from "../../assets/Spotify_Logo_CMYK_Green.png";
import LoginStyles from "./Login.module.css";

import { connect, ConnectedProps } from "react-redux";
import { storeAuthState } from "../../store/actions/auth";
import { getCurrentUserData } from "../../store/actions/user";
import { history } from "../..";

const mapDispatchToProps = {
  storeAuthState,
  getCurrentUserData,
};

const connector = connect(null, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type TProps = ReduxProps;

const Login: React.FC<TProps> = ({ storeAuthState }) => {
  useEffect(() => {
    const querystring = window.location.search;
    const urlParams = new URLSearchParams(querystring);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");
    console.log(accessToken, refreshToken);
    if (accessToken && refreshToken) {
      storeAuthState(accessToken, refreshToken);
      getCurrentUserData();
      history.replace("/");
    }
  }, [storeAuthState]);

  return (
    <div className={LoginStyles.login_container}>
      <div>
        <img className="" src={logo} alt="Logo" />
        <div className={LoginStyles.btn_wrap}>
          <button
            onClick={() => {
              window.location.assign("http://localhost:8888/login");
            }}
            className="btn btn--large btn--circle"
          >
            LOGIN TO SPOTIFY
          </button>
        </div>
      </div>
    </div>
  );
};

export default connector(Login);
