export enum AuthActionTypes {
  StoreAuthState,
  ClearAuthState,
}
export enum ErrorActionTypes {
  SET_ERROR = "SET_ERROR",
}
export enum HomeActionTypes {
  SET_LOADING = "SET_LOADING",
  SET_DATA = "SET_DATA",
  SET_HOME_ERROR = "SET_HOME_ERROR",
}
export enum PlaylistActionTypes {
  SET_PLAYLIST_LOADING = "SET_PLAYLIST_LOADING",
  SET_PLAYLIST_DATA = "SET_PLAYLIST_DATA",
  ADD_MORE_TRACKS = "ADD_MORE_TRACKS",
  SET_TRACKS_LIKES = "SET_TRACKS_LIKES",
}
export enum UserActionTypes {
  SET_TRACKS_LIKES = "SET_TRACKS_LIKES",
  SET_ALBUM_LIKES = "SET_ALBUM_LIKES",
  SET_PLAYLIST_LIKES = "SET_PLAYLIST_LIKES",
  SET_USER_DATA = "SET_USER_DATA",
}
export enum AlbumActionTypes {
  SET_ALBUM_LOADING = "SET_ALBUM_LOADING",
  SET_ALBUM_DATA = "SET_ALBUM_DATA",
  ADD_MORE_ALBUM_TRACKS = "ADD_MORE_ALBUM_TRACKS",
}

export enum SearchActionTypes {
  SET_SEARCH_LOADING = "SET_SEARCH_LOADING",
  SET_SEARCH_PLAYLISTS = "SET_SEARCH_PLAYLISTS",
  SET_SEARCH_ALBUMS = "SET_SEARCH_ALBUMS",
  SET_SEARCH_TRACKS = "SET_SEARCH_TRACKS",
  SET_SEARCH_ARTISTS = "SET_SEARCH_ARTISTS",
  SET_SEARCH_TERM = "SET_SEARCH_TERM",
  CLEAN_SEARCH_STATE = "CLEAR_SEARCH_STATE",
}
export enum LibraryActionTypes {
  SET_LIBRARY_LOADING = "SET_LIBRARY_LOADING",
  SET_LIBRARY_PLAYLISTS_LOADING = "SET_LIBRARY_PLAYLISTS_LOADING",
  SET_LIBRARY_ALBUMS = "SET_LIBRARY_ALBUMS",
  SET_LIBRARY_TRACKS = "SET_LIBRARY_TRACKS",
  SET_LIBRARY_PLAYLISTS = "SET_LIBRARY_PLAYLISTS",
  REMOVE_LIBRARY_PLAYLIST = "REMOVE_LIBRARY_PLAYLIST",
  ADD_LIBRARY_PLAYLIST = "ADD_LIBRARY_PLAYLIST",
}
