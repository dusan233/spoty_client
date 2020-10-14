import { CategoriesActionTypes } from "./actionTypes";
import {
  Category,
  SetCategoriesData,
  SetCategoriesLoading,
} from "../types/categories";
import { ActionCreator, Dispatch } from "redux";
import { RootState } from "../reducers";
import { api } from "../../axios";
import { batch } from "react-redux";

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
      console.log(err);
    }
  };
};
