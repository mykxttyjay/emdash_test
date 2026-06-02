import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Read seed data from .emdash/seed.json
    const seedPath = join(process.cwd(), '.emdash', 'seed.json');
    const seedData = JSON.parse(readFileSync(seedPath, 'utf-8'));

    const results = {
      imported: [] as string[],
      errors: [] as string[],
    };

    // Note: Emdash collections need to be populated through their API
    // This endpoint shows what would be imported
    
    for (const [collectionName, items] of Object.entries(seedData.content || {})) {
      if (Array.isArray(items)) {
        results.imported.push(`${collectionName}: ${items.length} items`);
      }
    }

    return new Response(
      JSON.stringify({
        status: 'info',
        message: 'Seed data structure validated',
        collections: results.imported,
        note: 'To populate data, use the Emdash admin panel at /_emdash/admin or access Emdash data layer API',
        totalCollections: Object.keys(seedData.content || {}).length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
