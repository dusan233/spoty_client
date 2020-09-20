import { ImageObject } from "./index";

export interface ArtistSimplified {
  name: string;
  id: string;
}
export interface ArtistFull extends ArtistSimplified {
  images: ImageObject[];
  genres: string[];
}
