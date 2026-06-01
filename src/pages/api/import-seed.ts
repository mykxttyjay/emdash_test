import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    // Read seed data
    const seedPath = join(process.cwd(), '.emdash', 'seed.json');
    const seedData = JSON.parse(readFileSync(seedPath, 'utf-8'));

    return new Response(
      JSON.stringify({
        status: 'info',
        message: 'Seed data loaded. Emdash should auto-import on first access.',
        collections: Object.keys(seedData.content || {}),
        instruction: 'Visit /_emdash/admin to trigger initialization, or try /_emdash/api/seed',
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
