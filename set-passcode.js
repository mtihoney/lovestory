// Usage:  node set-passcode.js "your new passcode"
// Updates passcodeHash in config.js so the site unlocks with the new passcode.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const code = process.argv.slice(2).join(' ').trim();
if (!code) {
  console.error('Usage: node set-passcode.js "your new passcode"');
  process.exit(1);
}
const file = path.join(__dirname, 'config.js');
const hash = crypto.createHash('sha256').update(code).digest('hex');
const src = fs.readFileSync(file, 'utf8');
if (!/passcodeHash:\s*"[0-9a-f]{64}"/.test(src)) {
  console.error('Could not find passcodeHash in config.js');
  process.exit(1);
}
fs.writeFileSync(file, src.replace(/passcodeHash:\s*"[0-9a-f]{64}"/, 'passcodeHash: "' + hash + '"'));
console.log('Passcode updated. The site now unlocks with: ' + code);
