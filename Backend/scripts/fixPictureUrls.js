// One-off migration: rewrite profile-photo URLs that were saved with a stale
// base (e.g. http://localhost:8000) to the correct production server URL.
//
// Only self-hosted uploads (URLs containing "/uploads/") are touched — external
// Google account pictures (lh3.googleusercontent.com) are left untouched.
//
// Usage (from the Backend folder):
//   node scripts/fixPictureUrls.js                       # uses SERVER_URL env as the new base
//   node scripts/fixPictureUrls.js https://my-api.com    # explicit new base
//   node scripts/fixPictureUrls.js https://my-api.com http://localhost:8000  # explicit new + old base
//   node scripts/fixPictureUrls.js --dry-run             # preview changes, write nothing
//
// Requires MONGO_URL in the environment (same as the app).

import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "../models/UserSchema.js";

dotenv.config();

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const positional = args.filter((a) => !a.startsWith("--"));

const NEW_BASE = (positional[0] || process.env.SERVER_URL || "").replace(/\/+$/, "");
const OLD_BASE = (positional[1] || "http://localhost:8000").replace(/\/+$/, "");

const run = async () => {
  if (!process.env.MONGO_URL) {
    console.error("✖ MONGO_URL is not set. Aborting.");
    process.exit(1);
  }
  if (!NEW_BASE) {
    console.error(
      "✖ No new base URL provided. Pass it as an argument or set SERVER_URL.\n" +
        "  e.g. node scripts/fixPictureUrls.js https://backnd-budgetbuddy.onrender.com"
    );
    process.exit(1);
  }
  if (NEW_BASE === OLD_BASE) {
    console.error(`✖ New base and old base are identical (${NEW_BASE}). Nothing to do.`);
    process.exit(1);
  }

  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URL);
  console.log("✔ Connected to MongoDB");
  console.log(`  Rewriting "${OLD_BASE}/uploads/..." → "${NEW_BASE}/uploads/..."`);
  if (dryRun) console.log("  (dry run — no writes)\n");

  // Match self-hosted uploads served from the old base.
  const prefix = `${OLD_BASE}/uploads/`;
  const users = await UserModel.find({ picture: { $regex: `^${escapeRegex(prefix)}` } });

  console.log(`Found ${users.length} user(s) with a stale picture URL.\n`);

  let updated = 0;
  for (const user of users) {
    const newPicture = user.picture.replace(OLD_BASE, NEW_BASE);
    console.log(`  ${user.email || user._id}`);
    console.log(`    - ${user.picture}`);
    console.log(`    + ${newPicture}`);
    if (!dryRun) {
      await UserModel.updateOne({ _id: user._id }, { $set: { picture: newPicture } });
    }
    updated++;
  }

  console.log(`\n${dryRun ? "Would update" : "Updated"} ${updated} user(s).`);
  await mongoose.disconnect();
  console.log("✔ Done. Disconnected.");
  process.exit(0);
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

run().catch(async (err) => {
  console.error("✖ Migration failed:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
