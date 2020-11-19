import { CategoriesActionTypes } from "./actionTypes";
import {
  Category,
  SetCategoriesData,
  SetCategoriesLoading,
  SetCategoryPlaylists,
} from "../types/categories";
import {setError} from './error';
import { ActionCreator, Dispatch } from "redux";
import { RootState } from "../reducers";
import { api } from "../../axios";
import { batch } from "react-redux";
import { PlaylistSimplified } from "../types/playlist";

export const setCategLoading: ActionCreator<SetCategoriesLoading> = (
  loading: boolean
) => ({
  type: CategoriesActionTypes.SET_CATEGORIES_LOADING,
  payload: loading,
});

export const setCategories: ActionCreator<SetCategoriesData> = (
  categories: Category[]
) => ({
  type: CategoriesActionTypes.SET_CATEGORIES_DATA,
  payload: categories,
});

export const setCategoryPlaylists: ActionCreator<SetCategoryPlaylists> = (
  items: PlaylistSimplified[], total: number, type: string = ""
  ) => ({
  type: CategoriesActionTypes.SET_CATEGORY_PLAYLISTS,
  payload:  {
    items,
    total,
    type
  }
})

export const getAllCategories = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;

    dispatch(setCategLoading(true));

    try {
      const res = await api.get<{ categories: { items: Category[] } }>(
        "/browse/categories",
        {
          params: {
            limit: 50,
            country: "US",
            locale: "us_US"
          },
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      batch(() => {
        dispatch(setCategories(res.data.categories.items));
        dispatch(setCategLoading(false));
      });
    } catch (err) {
      
      let errorMsg = "Opps! Something went wrong!";
       let subMsg = "Please refresh the page and try again";
       batch(() => {
        dispatch(setCategLoading(false));
        dispatch(setError(errorMsg, subMsg));
      });
    }
  };
};

export const getCategoryPlaylists = (categoryId: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const accessToken = getState().auth.accessToken;
    dispatch(setCategLoading(true))
    try {
      const res = await fetchCategoryPlaylists(categoryId, 0, accessToken);
     
      batch(() => {
        dispatch(setCategoryPlaylists(res.data.playlists.items, res.data.playlists.total))
        dispatch(setCategLoading(false))
      })
    }catch(err) {
      console.log(err);
      let errorMsg: string;
      let subMsg: string;
      if (err.response.status === 404) {
        errorMsg = "Couldn't find that category";
        subMsg = "Are you sure it exists?";
      } else {
        errorMsg = "Opps! Something went wrong!";
        subMsg = "Please refresh the page and try again";
      }
      batch(() => {
        dispatch(setCategLoading(false));
        dispatch(setError(errorMsg, subMsg));
      });
    }
  }
}
export const fetchCategoryPlaylists = (categoryId: string, offset: number, accessToken: string | undefined) => {
  return api.get<{playlists: {items: PlaylistSimplified[], total: number}}>(`/browse/categories/${categoryId}/playlists`, {
    params: {
      limit: 50,
      offset,
      country: "US",
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  })
}