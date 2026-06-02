import { readFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://emdash-cms-test.vercel.app';

async function importSeedData() {
  console.log('🌱 Starting seed data import...\n');

  // Read seed.json
  const seedPath = join(process.cwd(), '.emdash', 'seed.json');
  const seedData = JSON.parse(readFileSync(seedPath, 'utf-8'));

  console.log(`📦 Found ${Object.keys(seedData.content).length} collections to import\n`);

  // Import each collection
  for (const [collectionName, items] of Object.entries(seedData.content)) {
    console.log(`\n📁 Importing ${collectionName}...`);
    
    if (!Array.isArray(items)) {
      console.log(`   ⚠️  Skipping ${collectionName} - invalid format`);
      continue;
    }

    for (const item of items) {
      try {
        // Create item via Emdash API
        const response = await fetch(`${SITE_URL}/_emdash/api/content/${collectionName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...item.data,
            _status: item.status || 'published',
          }),
        });

        if (response.ok) {
          console.log(`   ✅ ${item.data.title || item.data.name || item.id}`);
        } else {
          const error = await response.text();
          console.log(`   ❌ Failed: ${error}`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
  }

  console.log('\n✨ Import complete!');
}

importSeedData().catch(console.error);
