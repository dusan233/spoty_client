import { LibraryState, LibraryActions } from "../types/library";
import { LibraryActionTypes } from "../actions/actionTypes";

const initialState: LibraryState = {
  albums: [],
  tracks: [],
  albumsTotal: 0,
  tracksTotal: 0,
  loading: true,
};

const reducer = (state = initialState, action: LibraryActions) => {
  switch (action.type) {
    case LibraryActionTypes.SET_LIBRARY_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case LibraryActionTypes.SET_LIBRARY_ALBUMS:
      return {
        ...state,
        albums: action.payload.items,
        albumsTotal: action.payload.total,
      };
    case LibraryActionTypes.SET_LIBRARY_TRACKS:
      return {
        ...state,
        tracks: action.payload.items,
        tracksTotal: action.payload.total,
      };
    default:
      return state;
  }
};

export default reducer;
