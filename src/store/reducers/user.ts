import { UserActionTypes } from "../actions/actionTypes";
import { UserState, UserActions } from "../types/user";

const initialState: UserState = {
  name: "",
  image: "",
  product: "",
  userId: "",
  trackLikes: [],
  albumLikes: [],
  playlistLikes: [],
  artistsLikes: [],
};

const reducer = (state = initialState, action: UserActions) => {
  switch (action.type) {
    case UserActionTypes.SET_TRACKS_LIKES:
      return {
        ...state,
        trackLikes:
          action.action === "add"
            ? state.trackLikes.concat(action.payload)
            : action.payload,
      };
    case UserActionTypes.SET_ALBUM_LIKES:
      return {
        ...state,
        albumLikes:
          action.action === "add"
            ? state.albumLikes.concat(action.payload)
            : action.payload,
      };

    case UserActionTypes.SET_PLAYLIST_LIKES:
      return {
        ...state,
        playlistLikes:
          action.action === "add"
            ? state.playlistLikes.concat(action.payload)
            : action.payload,
      };
    case UserActionTypes.SET_ARTISTS_LIKES:
      return {
        ...state,
        artistsLikes: action.payload,
      };
    case UserActionTypes.SET_USER_DATA:
      return {
        ...state,
        name: action.payload.name,
        image: action.payload.image,
        product: action.payload.product,
        userId: action.payload.userId,
      };
    default:
      return state;
  }
};

export default reducer;
