import React, { useState } from "react";
import SidebarStyles from "./Sidebar.module.css";
import logo from "../../assets/Spotify_Logo_CMYK_White.png";
import { NavLink } from "react-router-dom";
import { FiHome, FiSearch, FiPlus } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import CreatePlaylist from "../CreatePlaylist/CreatePlaylist";

import SidebarPlaylists from "../SidebarPlaylists/SidebarPlaylists";

Modal.setAppElement("#modal");
const Sidebar = () => {
  const [modalIsOpen, setModal] = useState(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <div className={SidebarStyles.sidebar}>
      <Modal
        className="Modal"
        overlayClassName="Overlay"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        closeTimeoutMS={400}
      >
        <CreatePlaylist closeModal={closeModal} />
      </Modal>
      <div className={SidebarStyles.sidebar__logo}>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
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
            to="/library/artists"
          >
            <div className={SidebarStyles.link__content}>
              <span>Artists</span>
            </div>
          </NavLink>
        </li>
      </ul>
      <div className={SidebarStyles.sidebar__heading}>PLAYLISTS</div>
      <ul className={SidebarStyles.sideabr__list}>
        <li className={SidebarStyles.sidebar__item}>
          <div onClick={openModal} className={SidebarStyles.sidebar__link}>
            <div className={SidebarStyles.link__content}>
              <div className={`${SidebarStyles["sidebar__playlists-icon"]}`}>
                <FiPlus />
              </div>
              <span>Create Playlist</span>
            </div>
          </div>
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
      <SidebarPlaylists />
    </div>
  );
};

export default Sidebar;
