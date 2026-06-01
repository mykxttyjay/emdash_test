import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Check environment variables
    const hasDbUrl = !!import.meta.env.TURSO_DATABASE_URL;
    const hasAuthToken = !!import.meta.env.TURSO_AUTH_TOKEN;
    const hasSecret = !!import.meta.env.EMDASH_SECRET;

    return new Response(
      JSON.stringify({
        status: 'ok',
        environment: {
          TURSO_DATABASE_URL: hasDbUrl ? 'configured' : 'missing',
          TURSO_AUTH_TOKEN: hasAuthToken ? 'configured' : 'missing',
          EMDASH_SECRET: hasSecret ? 'configured' : 'missing',
        },
        timestamp: new Date().toISOString(),
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
