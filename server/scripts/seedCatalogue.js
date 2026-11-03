import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { INITIAL_CATALOGUE } from './catalogueData.js';
import { connectDB, disconnectDB } from '../config/db.js';

dotenv.config();

/**
 * Seeds initial Bela Bakers catalogue without creating duplicates on repeated execution.
 * Uses $setOnInsert so existing owner edits in MongoDB are never overwritten.
 */
export const seedInitialCatalogue = async () => {
  let insertedCount = 0;
  let existingCount = 0;

  for (const item of INITIAL_CATALOGUE) {
    const result = await Product.updateOne(
      { slug: item.slug },
      { $setOnInsert: item },
      { upsert: true }
    );
    if (result.upsertedCount > 0) {
      insertedCount += 1;
    } else {
      existingCount += 1;
    }
  }

  console.log(
    `🎂 Bela Bakers Catalogue Seed Complete: ${insertedCount} new products added, ${existingCount} existing products preserved.`
  );
  return { insertedCount, existingCount };
};

// Allow running directly via `npm run seed`
const isDirectRun = process.argv[1] && process.argv[1].includes('seedCatalogue');
if (isDirectRun) {
  (async () => {
    try {
      await connectDB();
      await seedInitialCatalogue();
      await disconnectDB();
      process.exit(0);
    } catch (error) {
      console.error('❌ Catalogue seed failed:', error.message);
      process.exit(1);
    }
  })();
}
