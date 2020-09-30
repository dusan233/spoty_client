import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { setSearchTerm } from "../../store/actions/search";
import { history } from "../..";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import SearchbarStyles from "./Searchbar.module.css";
import { RiSearchLine } from "react-icons/ri";
import Dropdown from "../Dropdown/Dropdown";
import { Link } from "react-router-dom";
import DropdownStyles from "../Dropdown/Dropdown.module.css";
import { IoMdArrowDropdown } from "react-icons/io";
import NoImage from "../../assets/noimageartist.jpg";

const mapStateToProps = (state: RootState) => ({
  term: state.search.searchTerm,
  product: state.user.product,
  image: state.user.image,
  name: state.user.name,
});
const mapDispatchToProps = {
  setSearchTerm,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps;

const Searchbar: React.FC<Props> = ({
  term,
  setSearchTerm,
  image,
  name,
  product,
}) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(term);
  }, [term]);

  const onSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue((e.target as HTMLInputElement).value);
  };

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();

    history.push(`/search/playlist/${searchValue}`);
  };

  return (
    <div className={SearchbarStyles.wrap}>
      <form className={SearchbarStyles.form} onSubmit={onSearchSubmit}>
        <div className={SearchbarStyles.searchbar}>
          <div className={SearchbarStyles.icon}>
            <RiSearchLine />
          </div>
          <input
            onChange={onSearchValueChange}
            className={`${SearchbarStyles["searchbar-input"]}`}
            placeholder="Search for Artists, Songs, Playlists..."
            type="text"
            value={searchValue}
          />
        </div>
      </form>
      <div className={SearchbarStyles.user}>
        {product === "premium" ? null : (
          <a
            href="https://www.spotify.com/us/premium/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--white btn--circle"
          >
            Upgrade to Premium
          </a>
        )}
        <Dropdown>
          <div className={`${SearchbarStyles["dropdown-btn"]}`}>
            <img src={image || NoImage} alt="User" />
            <div>{name}</div>
            <div className={SearchbarStyles.icon}>
              <IoMdArrowDropdown />
            </div>
          </div>
          <div
            className={`${DropdownStyles.dropdown} ${DropdownStyles["dropdown--user"]}`}
          >
            <ul>
              <li>
                <Link className={DropdownStyles.link} to="/">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default connector(Searchbar);
