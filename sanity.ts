import { createClient, createCurrentUserHook } from 'next-sanity';
import createImageBuilder from '@sanity/image-url';

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  apiVersion: 'v1',
  useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config);

export const urlFor = (source: string) => createImageBuilder(config).image(source);

export const useCurrentUser = createCurrentUserHook(config);