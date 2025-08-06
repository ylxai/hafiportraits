/**
 * Check and Setup Authentication Database
 * Manual setup for Supabase authentication tables
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Checking Supabase configuration...');
console.log('Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Missing Supabase environment variables');
  console.error('Please check your .env.local file for:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndSetupAuth() {
  console.log('\n🔐 Checking authentication setup...');

  try {
    // 1. Check if admin_users table exists
    console.log('\n📋 Checking admin_users table...');
    const { data: existingUsers, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (checkError) {
      console.log('❌ admin_users table does not exist');
      console.log('Error:', checkError.message);
      console.log('\n📝 You need to create the tables manually in Supabase SQL Editor');
      console.log('\n🔧 MANUAL SETUP INSTRUCTIONS:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Run the following SQL commands:');
      
      console.log('\n-- CREATE ADMIN_USERS TABLE');
      console.log(`CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  full_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'superadmin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`);

      console.log('\n-- CREATE ADMIN_SESSIONS TABLE');
      console.log(`CREATE TABLE admin_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`);

      console.log('\n-- CREATE ADMIN_ACTIVITY_LOGS TABLE');
      console.log(`CREATE TABLE admin_activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  resource_id VARCHAR(50),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`);

      console.log('\n-- CREATE INDEXES');
      console.log(`CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX idx_admin_activity_logs_user_id ON admin_activity_logs(user_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);`);

      // Generate hashed passwords for manual insertion
      const hafiPassword = await bcrypt.hash('Hantu@112233', 12);
      const nandikaPassword = await bcrypt.hash('Hantu@112233', 12);

      console.log('\n-- INSERT DEFAULT USERS');
      console.log(`INSERT INTO admin_users (username, password_hash, email, full_name, role) VALUES 
('hafi', '${hafiPassword}', 'hafi@hafiportrait.com', 'Hafi Portrait', 'superadmin'),
('nandika', '${nandikaPassword}', 'nandika@hafiportrait.com', 'Nandika', 'superadmin');`);

      console.log('\n🎯 After running these SQL commands, try logging in again!');
      
    } else {
      console.log('✅ admin_users table exists');
      console.log(`Found ${existingUsers?.length || 0} users`);

      // Check if default users exist
      const { data: hafiUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', 'hafi')
        .single();

      const { data: nandikaUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', 'nandika')
        .single();

      console.log('User hafi:', hafiUser ? '✅ Exists' : '❌ Missing');
      console.log('User nandika:', nandikaUser ? '✅ Exists' : '❌ Missing');

      // If users don't exist, try to create them
      if (!hafiUser || !nandikaUser) {
        console.log('\n👥 Creating missing users...');
        
        const defaultUsers = [
          {
            username: 'hafi',
            password: 'Hantu@112233',
            email: 'hafi@hafiportrait.com',
            full_name: 'Hafi Portrait'
          },
          {
            username: 'nandika',
            password: 'Hantu@112233',
            email: 'nandika@hafiportrait.com',
            full_name: 'Nandika'
          }
        ];

        for (const user of defaultUsers) {
          const { data: existingUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('username', user.username)
            .single();

          if (!existingUser) {
            const hashedPassword = await bcrypt.hash(user.password, 12);
            
            const { error } = await supabase
              .from('admin_users')
              .insert({
                username: user.username,
                password_hash: hashedPassword,
                email: user.email,
                full_name: user.full_name,
                role: 'superadmin'
              });

            if (error) {
              console.error(`❌ Error creating user ${user.username}:`, error);
            } else {
              console.log(`✅ Created user: ${user.username}`);
            }
          }
        }
      }

      // Test password verification
      if (hafiUser) {
        console.log('\n🔐 Testing password verification...');
        const isValidPassword = await bcrypt.compare('Hantu@112233', hafiUser.password_hash);
        console.log('Password verification for hafi:', isValidPassword ? '✅ Valid' : '❌ Invalid');
        
        if (!isValidPassword) {
          console.log('🔄 Updating password hash...');
          const newHash = await bcrypt.hash('Hantu@112233', 12);
          const { error } = await supabase
            .from('admin_users')
            .update({ password_hash: newHash })
            .eq('username', 'hafi');
          
          if (error) {
            console.error('❌ Error updating password:', error);
          } else {
            console.log('✅ Password updated successfully');
          }
        }
      }
    }

    console.log('\n🎉 Setup check complete!');
    console.log('\n📋 Login Credentials:');
    console.log('Username: hafi | Password: Hantu@112233');
    console.log('Username: nandika | Password: Hantu@112233');

  } catch (error) {
    console.error('\n❌ Setup check failed:', error);
  }
}

checkAndSetupAuth();