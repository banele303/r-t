const { generateKeyPairSync } = require('crypto');
const { execSync } = require('child_process');

// Generate an EdDSA (ed25519) key which is recommended and shorter
const { privateKey } = generateKeyPairSync('ed25519');
const pkcs8 = privateKey.export({ type: 'pkcs8', format: 'pem' });

// Replace real newlines with literal '\n' characters so that 
// bunx convex env set interprets it as a single string argument.
const envString = pkcs8.replace(/\n/g, '\\n');

try {
  console.log("Setting JWT_PRIVATE_KEY...");
  execSync(`bunx convex env set JWT_PRIVATE_KEY "${envString}"`, { stdio: 'inherit' });
  console.log("Successfully securely configured JWT_PRIVATE_KEY!");
} catch (e) {
  console.error(e);
}
