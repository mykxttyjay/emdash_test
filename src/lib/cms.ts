import { getCollection as getAstroCollection, getEntry } from 'astro:content';

// Helper functions to fetch content from Emdash CMS
// EmDash integrates with Astro's content collections

export async function getCollection(collectionName: string) {
  try {
    const collection = await getAstroCollection(collectionName as any);
    return collection;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}

export async function getCollectionItem(collectionName: string, slug: string) {
  try {
    const item = await getEntry(collectionName as any, slug);
    return item;
  } catch (error) {
    console.error(`Error fetching item from ${collectionName}:`, error);
    return null;
  }
}

// Specific helper functions for common collections
export async function getServices() {
  return getCollection('services');
}

export async function getTestimonials() {
  return getCollection('testimonials');
}

export async function getPortfolio() {
  return getCollection('portfolio');
}

export async function getPages() {
  return getCollection('pages');
}

