import { CategoriesActionTypes } from "../actions/actionTypes";

export interface CategoriesState {
  loading: boolean;
  categories: Category[];
}

export interface SetCategoriesLoading {
  type: CategoriesActionTypes.SET_CATEGORIES_LOADING;
  payload: boolean;
}

export interface SetCategoriesData {
  type: CategoriesActionTypes.SET_CATEGORIES_DATA;
  payload: Category[];
}

export type CategoriesActions = SetCategoriesLoading | SetCategoriesData;

export interface Category {
  id: string;
  name: string;
  icons: {
    height: number;
    width: number;
    url: string;
  }[];
}
