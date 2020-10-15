import { CategoriesActionTypes } from "../actions/actionTypes";
import { CategoriesState, CategoriesActions } from "../types/categories";

const initialState: CategoriesState = {
  loading: true,
  categories: [],
  categoryPlaylists: [],
  total: 0
};

const reducer = (state = initialState, action: CategoriesActions) => {
  switch (action.type) {
    case CategoriesActionTypes.SET_CATEGORIES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CategoriesActionTypes.SET_CATEGORIES_DATA:
      return {
        ...state,
        categories: action.payload,
      };
      case CategoriesActionTypes.SET_CATEGORY_PLAYLISTS:
        return {
          ...state,
          categoryPlaylists: action.payload.items,
          total: action.payload.total
        }
    default:
      return state;
  }
};

export default reducer;
