import { HomeActionTypes } from "../actions/actionTypes";
import { HomeState, HomeActions } from "../types/home";

const initialState: HomeState = {
  featuredPlaylistsPrew: [],
  newReleases: [],
  loading: true,
  error: false,
};

const reducer = (state = initialState, action: HomeActions) => {
  switch (action.type) {
    case HomeActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case HomeActionTypes.SET_DATA:
      return {
        ...state,
        featuredPlaylistsPrew: action.payload.featuredPlaylists,
        newReleases: action.payload.newReleases,
      };
    default:
      return state;
  }
};

export default reducer;
