import { execSync } from 'child_process';
try {
  const result = execSync('npx convex run admin:isSuperAdmin', { stdio: 'pipe' });
  console.log('SUCCESS:\n', result.toString());
} catch (e) {
  console.log('STDOUT:\n', e.stdout ? e.stdout.toString() : '');
  console.error('STDERR:\n', e.stderr ? e.stderr.toString() : '');
}
