import { LibraryState, LibraryActions } from "../types/library";
import { LibraryActionTypes } from "../actions/actionTypes";

const initialState: LibraryState = {
  albums: [],
  tracks: [],
  playlists: [],
  albumsTotal: 0,
  tracksTotal: 0,
  playlistsTotal: 0,
  loadingPlaylists: true,
  loading: true,
};

const reducer = (state = initialState, action: LibraryActions) => {
  switch (action.type) {
    case LibraryActionTypes.SET_LIBRARY_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case LibraryActionTypes.SET_LIBRARY_PLAYLISTS_LOADING:
      return {
        ...state,
        loadingPlaylists: action.payload,
      };
    case LibraryActionTypes.SET_LIBRARY_ALBUMS:
      return {
        ...state,
        albums:
          action.payload.action === "add"
            ? state.albums.concat(action.payload.items)
            : action.payload.items,
        albumsTotal: action.payload.total,
      };
    case LibraryActionTypes.SET_LIBRARY_TRACKS:
      return {
        ...state,
        tracks:
          action.payload.action === "add"
            ? state.tracks.concat(action.payload.items)
            : action.payload.items,
        tracksTotal: action.payload.total,
      };
    case LibraryActionTypes.SET_LIBRARY_PLAYLISTS:
      return {
        ...state,
        playlists:
          action.payload.action === "add"
            ? state.playlists.concat(action.payload.items)
            : action.payload.items,
        playlistsTotal: action.payload.total,
      };
    case LibraryActionTypes.REMOVE_LIBRARY_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.filter(
          (playlist) => playlist.id !== action.payload.id
        ),
      };
    case LibraryActionTypes.ADD_LIBRARY_PLAYLIST:
      return {
        ...state,
        playlists: [action.payload, ...state.playlists],
      };
    default:
      return state;
  }
};

export default reducer;
