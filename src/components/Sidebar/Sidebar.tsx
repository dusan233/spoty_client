import React from "react";
import SidebarStyles from "./Sidebar.module.css";
import logo from "../../assets/Spotify_Logo_CMYK_White.png";
import { NavLink } from "react-router-dom";
import { FiHome, FiSearch, FiPlus } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className={SidebarStyles.sidebar}>
      <div className={SidebarStyles.sidebar__logo}>
        <img src={logo} alt="Logo" />
      </div>
      <ul className={SidebarStyles.sidebar__list}>
        <li className={SidebarStyles.sidebar__item}>
          <NavLink
            className={SidebarStyles.sidebar__link}
            to="/"
            exact
            activeClassName={SidebarStyles.sidebar__link_active}
          >
            <div className={SidebarStyles.link__content}>
              <FiHome className={SidebarStyles.link__icon} /> <span>Home</span>
            </div>
          </NavLink>
        </li>
        <li className={SidebarStyles.sidebar__item}>
          <NavLink
            className={SidebarStyles.sidebar__link}
            activeClassName={SidebarStyles.sidebar__link_active}
            to="/somewhere"
          >
            <div className={SidebarStyles.link__content}>
              <FiSearch className={SidebarStyles.link__icon} />
              <span>Browse</span>
            </div>
          </NavLink>
        </li>
      </ul>
      <div className={SidebarStyles.sidebar__heading}>YOUR LIBARY</div>
      <ul className={SidebarStyles.sideabr__list}>
        <li className={SidebarStyles.sidebar__item}>
          <NavLink
            className={SidebarStyles.sidebar__link}
            activeClassName={SidebarStyles.sidebar__link_active}
            to="/library/albums"
          >
            <div className={SidebarStyles.link__content}>
              <span>Albums</span>
            </div>
          </NavLink>
        </li>
        <li className={SidebarStyles.sidebar__item}>
          <NavLink
            className={SidebarStyles.sidebar__link}
            activeClassName={SidebarStyles.sidebar__link_active}
            to="/somewhere"
          >
            <div className={SidebarStyles.link__content}>
              <span>Artists</span>
            </div>
          </NavLink>
        </li>
        <li className={SidebarStyles.sidebar__item}>
          <NavLink
            className={SidebarStyles.sidebar__link}
            activeClassName={SidebarStyles.sidebar__link_active}
            to="/somewhere"
          >
            <div className={SidebarStyles.link__content}>
              <span>Podcasts</span>
            </div>
          </NavLink>
        </li>
      </ul>
      <div className={SidebarStyles.sidebar__heading}>PLAYLISTS</div>
      <ul className={SidebarStyles.sideabr__list}>
        <li className={SidebarStyles.sidebar__item}>
          <NavLink className={SidebarStyles.sidebar__link} to="/somewhere">
            <div className={SidebarStyles.link__content}>
              <div className={`${SidebarStyles["sidebar__playlists-icon"]}`}>
                <FiPlus />
              </div>
              <span>Create Playlist</span>
            </div>
          </NavLink>
          <NavLink
            className={SidebarStyles.sidebar__link}
            to="/library/tracks"
            activeClassName={`${SidebarStyles["sidebar__link-icon_active"]}`}
          >
            <div className={SidebarStyles.link__content}>
              <div
                className={`${SidebarStyles["sidebar__playlists-icon--colored"]}`}
              >
                <FaHeart />
              </div>
              <span>Liked Songs</span>
            </div>
          </NavLink>
        </li>
      </ul>
      <hr className={SidebarStyles.sidebar__devider} />
    </div>
  );
};

export default Sidebar;
