import { combineReducers } from "redux";
import AuthReducer from "./auth";
import HomeReducer from "./home";
import PlaylistReducer from "./playlist";
import AlbumReducer from "./album";
import SearchReducer from "./search";
import ErrorReducer from "./error";
import UserReducer from "./user";
import LibraryReducer from "./library";
import ArtistReducer from "./artist";
import CategoriesReducer from "./categories";
import MusicReducer from './music';

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  auth: AuthReducer,
  home: HomeReducer,
  playlist: PlaylistReducer,
  album: AlbumReducer,
  search: SearchReducer,
  error: ErrorReducer,
  user: UserReducer,
  library: LibraryReducer,
  artist: ArtistReducer,
  categories: CategoriesReducer,
  music: MusicReducer
});
