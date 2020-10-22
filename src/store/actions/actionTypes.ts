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
  SET_PLAYLIST_TRACKS = "SET_PLAYLIST_TRACKS",
  EDIT_PLAYLIST = "EDIT_PLAYLIST",
  SET_ADDING_TRACK = "SET_ADDING_TRACK"
}
export enum UserActionTypes {
  SET_TRACKS_LIKES = "SET_TRACKS_LIKES",
  SET_ALBUM_LIKES = "SET_ALBUM_LIKES",
  SET_PLAYLIST_LIKES = "SET_PLAYLIST_LIKES",
  SET_ARTISTS_LIKES = "SET_ARTISTS_LIKES",
  SET_USER_DATA = "SET_USER_DATA",
  SET_CREATING_PLAYLIST = "SET_CREATING_PLAYLIST",
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
  SET_LIBRARY_ARTISTS = "SET_LIBRARY_ARTISTS",
  EDIT_LIBRARY_PLAYLIST = "EDIT_LIBRARY_PLAYLIST",
}

export enum ArtistActionTypes {
  SET_ARTIST_LOADING = "SET_ARTIST_LOADING",
  SET_ARTIST_DATA = "SET_ARTIST_DATA",
  SET_MORE_ALBUMS = "SET_MORE_ALBUMS",
}
export enum CategoriesActionTypes {
  SET_CATEGORIES_LOADING = "SET_CATEGORIES_LOADING",
  SET_CATEGORIES_DATA = "SET_CATEGORIES_DATA",
  SET_CATEGORY_PLAYLISTS = "SET_CATEGORY_PLAYLISTS"
}

export enum MusicActionTypes {
  SET_CURRENT_SELECTED_SONG = "SET_CURRENT_SELECTED_SONG",
  SET_NEXT_UP_SONGS = "SET_NEXT_UP_SONGS",
  SET_PLAYING = "SET_PLAYING",
  SET_REPEAT = "SET_REPEAT",
  SET_TIME = "SET_TIME",
  SET_SLIDERS_VALUES = "SET_SLIDERS_VALUES",
  SET_VOLUME = "SET_VOLUME",
  SET_MUTE = "SET_MUTE"
}