#!/usr/bin/env node

/**
 * Supabase Setup Script for MagApp
 * This script helps validate and setup Supabase configuration
 */

const fs = require('fs');
const path = require('path');

const ENV_LOCAL_PATH = path.join(__dirname, '..', '.env.local');
const ENV_EXAMPLE_PATH = path.join(__dirname, '..', '.env.example');

function checkEnvFile() {
  console.log('🔍 Checking environment configuration...\n');

  if (!fs.existsSync(ENV_LOCAL_PATH)) {
    console.log('❌ .env.local file not found');
    console.log('📝 Creating .env.local from .env.example...');
    
    if (fs.existsSync(ENV_EXAMPLE_PATH)) {
      fs.copyFileSync(ENV_EXAMPLE_PATH, ENV_LOCAL_PATH);
      console.log('✅ .env.local created successfully');
      console.log('⚠️  Please update the Supabase credentials in .env.local\n');
    } else {
      console.log('❌ .env.example not found');
      return false;
    }
  }

  // Read and validate environment variables
  const envContent = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');
  const hasPlaceholders = envContent.includes('your_supabase_project_url') || 
                          envContent.includes('your_supabase_anon_key') ||
                          envContent.includes('your_supabase_service_role_key');

  if (hasPlaceholders) {
    console.log('⚠️  Supabase credentials contain placeholder values');
    console.log('📋 Please update the following in .env.local:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY\n');
    return false;
  }

  console.log('✅ .env.local file exists and appears configured\n');
  return true;
}

function checkSupabaseFiles() {
  console.log('📁 Checking Supabase configuration files...');

  const requiredFiles = [
    'lib/supabase/client.ts',
    'lib/supabase/server.ts',
    'lib/supabase/config-validator.ts',
    'lib/supabase/validation.ts',
    'types/database.ts',
    'types/auth.ts',
    'middleware.ts',
    'supabase/migrations/001_initial_schema.sql'
  ];

  let allFilesExist = true;

  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file}`);
      allFilesExist = false;
    }
  });

  return allFilesExist;
}

function checkDependencies() {
  console.log('\n📦 Checking dependencies...');
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const requiredDeps = [
    '@supabase/supabase-js',
    '@supabase/ssr',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    'sonner'
  ];

  let allDepsInstalled = true;

  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep} (${dependencies[dep]})`);
    } else {
      console.log(`❌ ${dep} - not installed`);
      allDepsInstalled = false;
    }
  });

  return allDepsInstalled;
}

function showSetupGuide() {
  console.log('\n📖 Setup Guide:');
  console.log('1. Read SUPABASE_SETUP.md for detailed instructions');
  console.log('2. Create a Supabase project at https://supabase.com');
  console.log('3. Get your project credentials from Settings > API');
  console.log('4. Update .env.local with your actual Supabase credentials');
  console.log('5. Run the SQL migration in Supabase SQL Editor');
  console.log('6. Configure authentication settings in Supabase dashboard');
  console.log('7. Test the configuration by running: pnpm dev\n');
}

function showNextSteps() {
  console.log('\n🎯 Next Steps:');
  console.log('1. ✅ Supabase configuration files are ready');
  console.log('2. 📝 Update .env.local with your Supabase credentials');
  console.log('3. 🗄️  Run the database migration in Supabase');
  console.log('4. 🔧 Configure authentication settings');
  console.log('5. 🧪 Test with: pnpm dev');
  console.log('\n📚 For detailed instructions, see: SUPABASE_SETUP.md\n');
}

function showSuccessMessage() {
  console.log('\n🎉 Supabase Setup Complete!');
  console.log('✅ All configuration files are present');
  console.log('✅ Environment variables appear to be configured');
  console.log('✅ All required dependencies are installed');
  console.log('\n🚀 You can now start implementing authentication features!');
  console.log('📝 Next: Implement authentication context and components\n');
}

function main() {
  console.log('🚀 Supabase Setup Validator for MagApp');
  console.log('=====================================\n');

  const envConfigured = checkEnvFile();
  const filesExist = checkSupabaseFiles();
  const depsInstalled = checkDependencies();

  console.log('\n📊 Setup Status:');
  console.log(`Environment: ${envConfigured ? '✅' : '❌'}`);
  console.log(`Files: ${filesExist ? '✅' : '❌'}`);
  console.log(`Dependencies: ${depsInstalled ? '✅' : '❌'}`);

  if (!filesExist) {
    console.log('\n❌ Some Supabase configuration files are missing');
    console.log('This usually means the setup task hasn\'t been completed yet.');
  } else if (!envConfigured) {
    showNextSteps();
  } else if (!depsInstalled) {
    console.log('\n❌ Some required dependencies are missing');
    console.log('Run: pnpm install');
  } else {
    showSuccessMessage();
  }

  if (!envConfigured || !filesExist) {
    showSetupGuide();
  }
}

main();