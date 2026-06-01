import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    // This endpoint will trigger Emdash to initialize the database
    // Visit this URL once to set up the collections
    
    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Database initialization triggered. Go to /_emdash/admin to see collections.',
        note: 'Collections should now appear in the admin panel. You may need to manually add content.',
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
