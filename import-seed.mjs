import { readFileSync } from 'fs';
import { createClient } from '@libsql/client';

// Load environment variables
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
  process.exit(1);
}

console.log('🔌 Connecting to Turso database...');
const db = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

console.log('📖 Reading seed data...');
const seedData = JSON.parse(readFileSync('.emdash/seed.json', 'utf-8'));

console.log('✅ Seed data loaded successfully!');
console.log(`📦 Found ${Object.keys(seedData.content || {}).length} content collections`);

// Note: Emdash handles seed import through its admin panel
// Visit your-site.vercel.app/_emdash/admin and look for import/seed options
console.log('\n📝 To import seed data:');
console.log('1. Go to your Vercel site: https://your-site.vercel.app/_emdash/admin');
console.log('2. Look for "Import" or "Seed" option in the admin panel');
console.log('3. Or the collections should auto-initialize on first access');

process.exit(0);
