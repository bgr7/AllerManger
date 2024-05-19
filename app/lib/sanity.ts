import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityClient } from "@sanity/client";

export const client: SanityClient = createClient({
  projectId: "so8sg33u",
  dataset: "production",
  apiVersion: "2024-07-03",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN, // Token'ı çevresel değişkenlerden alın
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
