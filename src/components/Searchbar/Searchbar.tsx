import React, { useState, ChangeEvent, FormEvent } from "react";
import { setSearchTerm } from "../../store/actions/search";
import { history } from "../..";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducers/index";
import SearchbarStyles from "./Searchbar.module.css";

const mapStateToProps = (state: RootState) => ({
  term: state.search.searchTerm,
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
    <div>
      <form onSubmit={onSearchSubmit}>
        <input
          onChange={onSearchValueChange}
          className={SearchbarStyles.searchbar}
          placeholder="Search for Artists, Songs, Playlists..."
          type="text"
          value={searchValue}
        />
      </form>
    </div>
  );
};

export default connector(Searchbar);
