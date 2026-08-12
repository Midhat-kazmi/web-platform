/**
 * Seeds the `order` field on every Core Team member according to the agreed
 * hierarchy, so the public About page ordering is persisted in the DB instead
 * of relying on the client-side fallback.
 *
 * Hierarchy (lower = shown first):
 *   Founder -> Moeez -> Abdul Moiz -> Chief/Officer -> Heads ->
 *   Senior Leads -> Specialty/Program Leads (GSOC, DevOps, etc.) ->
 *   generic Technical Leads -> Mentors -> Managers -> everyone else.
 *
 * Hidden members (Muhammad Ali, Muhammad Faraz) are pushed to the end so the
 * visible 1..N ordering matches what the About page renders.
 *
 * Usage (from project root, with a VALID MONGODB_URI in .env):
 *   node scripts/seed-core-team-order.mjs            # apply
 *   node scripts/seed-core-team-order.mjs --dry-run  # preview only
 */
import 'dotenv/config';
import mongoose from 'mongoose';

const DRY_RUN = process.argv.includes('--dry-run');
const HIDDEN = new Set(['muhammad ali', 'muhammad faraz']);

function rank(name, role) {
  const n = (name || '').trim().toLowerCase();
  const r = (role || '').toLowerCase();
  if (n === 'zeeshan adil' || r === 'founder') return 0;
  if (n.includes('moeez')) return 1;
  if (n === 'abdul moiz') return 2;
  if (r.includes('chief') || r.includes('officer')) return 10;
  if (r.includes('head')) return 20;
  if ((r.includes('sr.') || r.includes('senior')) && r.includes('lead')) return 30;
  if (r.includes('lead') && r.includes('technical')) return 45;
  if (r.includes('lead')) return 40;
  if (r.includes('mentor')) return 50;
  if (r.includes('manager')) return 60;
  return 70;
}

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!uri) {
    console.error('No MONGODB_URI found in .env');
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const col = mongoose.connection.db.collection('coreteammembers');
  const members = await col.find({}).toArray();
  console.log(`Fetched ${members.length} members.`);

  const sorted = [...members].sort((a, b) => {
    const ha = HIDDEN.has((a.name || '').trim().toLowerCase());
    const hb = HIDDEN.has((b.name || '').trim().toLowerCase());
    if (ha !== hb) return ha ? 1 : -1; // hidden members last
    return rank(a.name, a.role) - rank(b.name, b.role);
  });

  sorted.forEach((m, i) => {
    const hidden = HIDDEN.has((m.name || '').trim().toLowerCase());
    console.log(`${String(i + 1).padStart(2)}. ${m.name?.trim()} — ${m.role}${hidden ? '  (hidden on /about)' : ''}`);
  });

  if (DRY_RUN) {
    console.log('\nDry run — no changes written.');
  } else {
    await col.bulkWrite(
      sorted.map((m, i) => ({
        updateOne: { filter: { _id: m._id }, update: { $set: { order: i + 1 } } },
      }))
    );
    console.log('\nDone — order written for all members.');
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('Failed:', e.message);
  process.exit(1);
});
