import { SearchActionTypes } from "../actions/actionTypes";
import { ISearchState, SearchActions } from "../types/search";
import { setPlaylistLoading } from "../actions/playlist";

const initialState: ISearchState = {
  loading: false,
  searchArtists: [],
  artistsTerm: "",
  artistsTotal: 0,
  searchTracks: [],
  tracksTerm: "",
  tracksTotal: 0,
  searchAlbums: [],
  albumsTerm: "",
  albumsTotal: 0,
  searchPlaylists: [],
  playlistsTerm: "",
  playlistsTotal: 0,
  searchTerm: "",
};

const reducer = (state = initialState, action: SearchActions) => {
  switch (action.type) {
    case SearchActionTypes.SET_SEARCH_PLAYLISTS:
      return {
        ...state,
        searchPlaylists:
          action.payload.type === "add"
            ? state.searchPlaylists.concat(action.payload.items)
            : [...action.payload.items],
        playlistsTotal: action.payload.total,
        playlistsTerm: action.payload.term,
      };
    case SearchActionTypes.SET_SEARCH_ALBUMS:
      return {
        ...state,
        searchAlbums:
          action.payload.type === "add"
            ? state.searchAlbums.concat(action.payload.items)
            : [...action.payload.items],
        albumsTotal: action.payload.total,
        albumsTerm: action.payload.term,
      };
    case SearchActionTypes.SET_SEARCH_ARTISTS:
      return {
        ...state,
        searchArtists:
          action.payload.type === "add"
            ? state.searchArtists.concat(action.payload.items)
            : [...action.payload.items],
        artistsTotal: action.payload.total,
        artistsTerm: action.payload.term,
      };
    case SearchActionTypes.SET_SEARCH_TRACKS:
      return {
        ...state,
        searchTracks:
          action.payload.type === "add"
            ? state.searchTracks.concat(action.payload.items)
            : [...action.payload.items],
        tracksTotal: action.payload.total,
        tracksTerm: action.payload.term,
      };
    case SearchActionTypes.SET_SEARCH_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SearchActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload.term,
      };

    default:
      return state;
  }
};

export default reducer;
