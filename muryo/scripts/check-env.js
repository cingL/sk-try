// Check environment variables configuration
// Run with: node scripts/check-env.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

console.log('🔍 Checking .env.local configuration...\n');

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));

  const envVars = {};
  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  // Check required variables
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_EVENT_ID'];
  const missing = required.filter(key => !envVars[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }

  // Validate formats
  const urlPattern = /^https:\/\/.+\.supabase\.co$/;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const jwtPattern = /^eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\./;

  const checks = [
    {
      name: 'VITE_SUPABASE_URL',
      value: envVars.VITE_SUPABASE_URL,
      valid: urlPattern.test(envVars.VITE_SUPABASE_URL),
      format: 'https://xxx.supabase.co'
    },
    {
      name: 'VITE_SUPABASE_ANON_KEY',
      value: envVars.VITE_SUPABASE_ANON_KEY.substring(0, 50) + '...',
      valid: jwtPattern.test(envVars.VITE_SUPABASE_ANON_KEY) && envVars.VITE_SUPABASE_ANON_KEY.length > 100,
      format: 'JWT token (starts with eyJ...)'
    },
    {
      name: 'VITE_EVENT_ID',
      value: envVars.VITE_EVENT_ID,
      valid: uuidPattern.test(envVars.VITE_EVENT_ID),
      format: 'UUID format'
    }
  ];

  console.log('📋 Configuration Check Results:\n');
  let allValid = true;

  checks.forEach(check => {
    const status = check.valid ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
    console.log(`   Value: ${check.value}`);
    console.log(`   Format: ${check.format}`);
    console.log(`   Valid: ${check.valid ? 'Yes' : 'No'}\n`);
    if (!check.valid) allValid = false;
  });

  if (allValid) {
    console.log('✅ All environment variables are correctly configured!');
    console.log('\n🚀 You can now run: npm run dev');
  } else {
    console.error('❌ Some environment variables have invalid formats.');
    console.error('Please check your .env.local file and fix the issues above.');
    process.exit(1);
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('❌ .env.local file not found!');
    console.error('Please create .env.local file in the project root.');
    console.error('See .env.local.example for reference.');
  } else {
    console.error('❌ Error reading .env.local:', error.message);
  }
  process.exit(1);
}
