export enum AuthActionTypes {
  StoreAuthState,
  ClearAuthState,
}
export enum HomeActionTypes {
  SET_LOADING = "SET_LOADING",
  SET_DATA = "SET_DATA",
}
export enum PlaylistActionTypes {
  SET_PLAYLIST_LOADING = "SET_PLAYLIST_LOADING",
  SET_PLAYLIST_DATA = "SET_PLAYLIST_DATA",
  ADD_MORE_TRACKS = "ADD_MORE_TRACKS",
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
}
