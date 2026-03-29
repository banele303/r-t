const { generateKeyPairSync } = require('crypto');
const { execSync } = require('child_process');

try {
  // Generate an ed25519 key
  const { privateKey } = generateKeyPairSync('ed25519');
  const pkcs8 = privateKey.export({ type: 'pkcs8', format: 'pem' });
  
  // Create a clean one-line version for setting via CLI
  const envString = pkcs8.replace(/\n/g, '\\n');
  
  console.log("Setting JWT_PRIVATE_KEY...");
  // Use a temporary JS file to set the env var to avoid shell escaping issues
  const setScript = `const { execSync } = require('child_process'); \n execSync('npx convex env set JWT_PRIVATE_KEY "${envString}"', { stdio: 'inherit' });`;
  require('fs').writeFileSync('tmp_set_jwt.js', setScript);
  execSync('node tmp_set_jwt.js', { stdio: 'inherit' });
  require('fs').unlinkSync('tmp_set_jwt.js');
  
  console.log("Success!");
} catch (e) {
  console.error("Failed to set JWT key:", e.message);
}
