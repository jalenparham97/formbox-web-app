import { createApi } from "unsplash-js";
import { type Basic } from "unsplash-js/dist/methods/photos/types";
import { env } from "@/env";

export const unsplash = createApi({
  accessKey: env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

export type UnsplashPhoto = Basic;
