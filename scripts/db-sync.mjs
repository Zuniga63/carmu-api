import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');

let envContent;
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch {
  console.error(`Error: .env file not found at ${envPath}`);
  process.exit(1);
}

const match = envContent.match(/^DB_URL=["']?(.+?)["']?$/m);
const dbUrl = match?.[1];

if (!dbUrl) {
  console.error('Error: DB_URL not found or empty in .env');
  process.exit(1);
}

if (/localhost|127\.0\.0\.1/.test(dbUrl)) {
  console.error('Error: DB_URL points to localhost. Set it to the production URL before syncing.');
  process.exit(1);
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

console.log('Starting database sync...');

console.log('1/3 Dumping production database...');
run(`docker exec carmu-mongodb mongodump --uri="${dbUrl}" --out=/tmp/dump`);

console.log('2/3 Restoring to local database...');
run('docker exec carmu-mongodb mongorestore --db=carmu-main --drop /tmp/dump/carmu-main');

console.log('3/3 Cleaning up temporary files...');
run('docker exec carmu-mongodb rm -rf /tmp/dump');

console.log('Done! Database synced successfully.');
