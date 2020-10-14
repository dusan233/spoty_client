import { CategoriesActionTypes } from "../actions/actionTypes";
import { CategoriesState, CategoriesActions } from "../types/categories";

const initialState: CategoriesState = {
  loading: true,
  categories: [],
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
    default:
      return state;
  }
};

export default reducer;
