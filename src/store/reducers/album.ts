import { AlbumActionTypes } from "../actions/actionTypes";
import { AlbumState } from "../types/album";
import { AlbumActions } from "../types/album";

const initialState: AlbumState = {
  name: "",
  owner: [],
  img: undefined,
  tracks: [],
  loading: true,
  id: "",
  total: 0,
  type: "",
  date: "",
};

const reducer = (state = initialState, action: AlbumActions) => {
  switch (action.type) {
    case AlbumActionTypes.SET_ALBUM_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case AlbumActionTypes.SET_ALBUM_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case AlbumActionTypes.ADD_MORE_ALBUM_TRACKS:
      return {
        ...state,
        tracks: [...state.tracks, ...action.payload],
      };
    default:
      return state;
  }
};

export default reducer;
