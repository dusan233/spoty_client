import { CategoriesActionTypes } from "../actions/actionTypes";
import { PlaylistSimplified } from "./playlist";

export interface CategoriesState {
  loading: boolean;
  categories: Category[];
  categoryPlaylists: PlaylistSimplified[];
  total: number;
}

export interface SetCategoriesLoading {
  type: CategoriesActionTypes.SET_CATEGORIES_LOADING;
  payload: boolean;
}

export interface SetCategoryPlaylists {
  type: CategoriesActionTypes.SET_CATEGORY_PLAYLISTS;
  payload: {
    items: PlaylistSimplified[],
    total: number;
    type: string;
  }
}

export interface SetCategoriesData {
  type: CategoriesActionTypes.SET_CATEGORIES_DATA;
  payload: Category[];
}

export type CategoriesActions = SetCategoriesLoading | SetCategoriesData | SetCategoryPlaylists;

export interface Category {
  id: string;
  name: string;
  icons: {
    height: number;
    width: number;
    url: string;
  }[];
}
