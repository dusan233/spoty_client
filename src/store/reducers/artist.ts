import { ArtistState, ArtistActions } from "../types/artist";
import { ArtistActionTypes } from "../actions/actionTypes";
const initialState: ArtistState = {
  name: "",
  followers: 0,
  image: "",
  loading: true,
  topTracks: [],
  artists: [],
  albums: [],
  albumsTotal: 0,
};

const reducer = (state = initialState, action: ArtistActions) => {
  switch (action.type) {
    case ArtistActionTypes.SET_ARTIST_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ArtistActionTypes.SET_ARTIST_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case ArtistActionTypes.SET_MORE_ALBUMS:
      return {
        ...state,
        albums: state.albums.concat(action.payload),
      };
    default:
      return state;
  }
};

export default reducer;
