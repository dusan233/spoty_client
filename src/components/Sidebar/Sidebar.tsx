import React from "react";
import SidebarStyles from "./Sidebar.module.css";
import logo from "../../assets/Spotify_Logo_CMYK_White.png";
import { NavLink } from "react-router-dom";
import { FiHome, FiSearch } from "react-icons/fi";

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
            to="/library/tracks"
          >
            <div className={SidebarStyles.link__content}>
              <span>Liked Songs</span>
            </div>
          </NavLink>
        </li>
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
    </div>
  );
};

export default Sidebar;
