import { UserActionTypes } from "../actions/actionTypes";
import { UserState, UserActions } from "../types/user";

const initialState: UserState = {
  trackLikes: [],
  albumLikes: [],
};

const reducer = (state = initialState, action: UserActions) => {
  switch (action.type) {
    case UserActionTypes.SET_TRACKS_LIKES:
      return {
        ...state,
        trackLikes: action.payload,
      };
    case UserActionTypes.SET_ALBUM_LIKES:
      return {
        ...state,
        albumLikes: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
