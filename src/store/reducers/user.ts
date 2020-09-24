import { UserActionTypes } from "../actions/actionTypes";
import { UserState, UserActions } from "../types/user";

const initialState: UserState = {
  trackLikes: [],
};

const reducer = (state = initialState, action: UserActions) => {
  switch (action.type) {
    case UserActionTypes.SET_TRACKS_LIKES:
      return {
        ...state,
        trackLikes: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
