const { generateKeyPairSync } = require('crypto');
const { execSync } = require('child_process');

try {
  console.log("Generating new PKCS#8 keys...");
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  
  const pkcs8 = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const spki = publicKey.export({ type: 'spki', format: 'pem' });
  
  // Create JWKS (required by library)
  const jwks = JSON.stringify({
    keys: [{
      kty: 'OKP',
      crv: 'Ed25519',
      x: publicKey.export({ type: 'spki', format: 'der' }).slice(-32).toString('base64url'),
      kid: 'default',
      alg: 'EdDSA',
      use: 'sig'
    }]
  });

  const envString = pkcs8.replace(/\n/g, '\\n');
  const jwksString = jwks.replace(/"/g, '\\"');

  console.log("Uploading to Convex (clear-shark-224)...");
  execSync(`npx convex env set JWT_PRIVATE_KEY "${envString}" --deployment-name clear-shark-224`, { stdio: 'inherit' });
  execSync(`npx convex env set JWKS "${jwksString}" --deployment-name clear-shark-224`, { stdio: 'inherit' });
  
  console.log("Uploading to Convex (flippant-anaconda-453)...");
  execSync(`npx convex env set JWT_PRIVATE_KEY "${envString}" --deployment-name flippant-anaconda-453`, { stdio: 'inherit' });
  execSync(`npx convex env set JWKS "${jwksString}" --deployment-name flippant-anaconda-453`, { stdio: 'inherit' });

  console.log("Success! Keys are correctly formatted and uploaded.");
} catch (e) {
  console.error("Error generating keys:", e);
}
