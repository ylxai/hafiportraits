/**
 * Setup Authentication Database
 * Run this script to create authentication tables and default users
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAuthDatabase() {
  console.log('🔐 Setting up authentication database...');

  try {
    // 1. Create admin_users table
    console.log('📋 Creating admin_users table...');
    const { error: usersTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_users (
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
        );
      `
    });

    if (usersTableError) {
      console.error('❌ Error creating admin_users table:', usersTableError);
    } else {
      console.log('✅ admin_users table created');
    }

    // 2. Create admin_sessions table
    console.log('📋 Creating admin_sessions table...');
    const { error: sessionsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_sessions (
          id VARCHAR(255) PRIMARY KEY,
          user_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
          expires_at TIMESTAMP NOT NULL,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (sessionsTableError) {
      console.error('❌ Error creating admin_sessions table:', sessionsTableError);
    } else {
      console.log('✅ admin_sessions table created');
    }

    // 3. Create admin_activity_logs table
    console.log('📋 Creating admin_activity_logs table...');
    const { error: logsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_activity_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
          action VARCHAR(100) NOT NULL,
          resource VARCHAR(100),
          resource_id VARCHAR(50),
          details JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (logsTableError) {
      console.error('❌ Error creating admin_activity_logs table:', logsTableError);
    } else {
      console.log('✅ admin_activity_logs table created');
    }

    // 4. Create indexes
    console.log('📋 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);',
      'CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_user_id ON admin_activity_logs(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);'
    ];

    for (const indexSql of indexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (error) {
        console.error('❌ Error creating index:', error);
      }
    }
    console.log('✅ Indexes created');

    // 5. Create default superadmin users
    console.log('👥 Creating default superadmin users...');
    
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
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', user.username)
        .single();

      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        // Insert user
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
          console.log(`✅ Created superadmin user: ${user.username}`);
        }
      } else {
        console.log(`ℹ️ User ${user.username} already exists`);
      }
    }

    console.log('\n🎉 Authentication database setup complete!');
    console.log('\n📋 Summary:');
    console.log('✅ Database tables created');
    console.log('✅ Indexes created');
    console.log('✅ Default superadmin users created');
    console.log('\n👥 Default Users:');
    console.log('Username: hafi | Password: Hantu@112233');
    console.log('Username: nandika | Password: Hantu@112233');
    console.log('\n🔐 You can now login to /admin with these credentials');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupAuthDatabase();
}

module.exports = { setupAuthDatabase };