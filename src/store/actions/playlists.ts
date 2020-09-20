import { api } from "../../axios";
import { FeaturedPlaylists } from "../types/playlist";

export const fetchFeaturedPlaylists = (accessToken: string | undefined) => {
  return api.get<FeaturedPlaylists>("/browse/featured-playlists", {
    params: {
      limit: 20,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};
