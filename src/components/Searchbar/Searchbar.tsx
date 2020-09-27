import React, { useState, ChangeEvent, FormEvent } from "react";
import { setSearchTerm } from "../../store/actions/search";
import { history } from "../..";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import SearchbarStyles from "./Searchbar.module.css";
import { RiSearchLine } from "react-icons/ri";

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

const Searchbar: React.FC<Props> = ({ term, setSearchTerm }) => {
  const [searchValue, setSearchValue] = useState("");

  //   useEffect(() => {
  //     setSearchValue(term);
  //   }, [term]);

  const onSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue((e.target as HTMLInputElement).value);
  };

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue !== "" && searchValue !== term) {
      history.push(`/search/playlist/${searchValue}`);
      setSearchValue("");
    }
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
        <a
          href="https://www.spotify.com/us/premium/"
          target="_blank"
          className="btn btn--white btn--circle"
        >
          Upgrade to Premium
        </a>
      </div>
    </div>
  );
};

export default connector(Searchbar);
