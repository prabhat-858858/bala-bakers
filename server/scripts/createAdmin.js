import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';
import { connectDB, disconnectDB } from '../config/db.js';

dotenv.config();

/**
 * Ensures the initial owner account exists in MongoDB.
 * Reads credentials from INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD in .env
 * or CLI arguments: node scripts/createAdmin.js <email> <password>
 */
export const ensureInitialOwner = async (cliEmail, cliPassword) => {
  const email = String(
    cliEmail || process.env.INITIAL_ADMIN_EMAIL || 'owner@belabakers.com'
  )
    .toLowerCase()
    .trim();
  const password = String(
    cliPassword || process.env.INITIAL_ADMIN_PASSWORD || 'BelaBakers@9060305323'
  );

  if (password.length < 8) {
    throw new Error('Owner password must be at least 8 characters long.');
  }

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    if (cliEmail && cliPassword) {
      existing.passwordHash = await bcrypt.hash(password, 12);
      await existing.save();
      console.log(`🔐 Updated password for owner account: ${email}`);
    } else {
      console.log(`🔐 Owner account already exists: ${email}`);
    }
    return existing;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await AdminUser.create({
    email,
    passwordHash,
    role: 'owner',
  });

  console.log(`✅ Created Bela Bakers Owner Account: ${email}`);
  return admin;
};

const isDirectRun = process.argv[1] && process.argv[1].includes('createAdmin');
if (isDirectRun) {
  (async () => {
    try {
      const [, , argEmail, argPassword] = process.argv;
      await connectDB();
      await ensureInitialOwner(argEmail, argPassword);
      await disconnectDB();
      process.exit(0);
    } catch (error) {
      console.error('❌ Failed to create owner account:', error.message);
      process.exit(1);
    }
  })();
}
