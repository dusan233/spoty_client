import { PlaylistActionTypes } from "../actions/actionTypes";
import { PlaylistState, PlaylistActions } from "../types/playlist";

const initialState: PlaylistState = {
  name: "",
  owner: "",
  ownerId: "",
  followers: 0,
  description: null,
  img: undefined,
  tracks: [],
  loading: true,
  id: "",
  total: 0,
  type: "",
};

const reducer = (state = initialState, action: PlaylistActions) => {
  switch (action.type) {
    case PlaylistActionTypes.SET_PLAYLIST_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case PlaylistActionTypes.EDIT_PLAYLIST:
      return {
        ...state,
        name: action.payload.name,
        description: action.payload.description,
      };
    case PlaylistActionTypes.SET_PLAYLIST_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case PlaylistActionTypes.ADD_MORE_TRACKS:
      return {
        ...state,
        tracks: [...state.tracks, ...action.payload],
      };
    case PlaylistActionTypes.SET_PLAYLIST_TRACKS:
      return {
        ...state,
        tracks: action.payload,
        total: state.total - 1,
      };
    default:
      return state;
  }
};

export default reducer;
