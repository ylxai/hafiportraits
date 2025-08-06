/**
 * Debug Authentication System
 * Check database connection, users, and password verification
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 DEBUGGING AUTHENTICATION SYSTEM');
console.log('=====================================');

// Check environment variables
console.log('\n1. 🔧 ENVIRONMENT VARIABLES:');
console.log('Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Missing environment variables!');
  console.error('Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAuth() {
  try {
    console.log('\n2. 🗄️ DATABASE CONNECTION TEST:');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Database connection failed:', testError.message);
      return;
    } else {
      console.log('✅ Database connection successful');
    }

    console.log('\n3. 👥 CHECKING ADMIN USERS:');
    
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('admin_users')
      .select('*');
    
    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
      return;
    }
    
    console.log(`Found ${users?.length || 0} users in database`);
    
    if (users && users.length > 0) {
      users.forEach(user => {
        console.log(`\n👤 User: ${user.username}`);
        console.log(`   - ID: ${user.id}`);
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Full Name: ${user.full_name}`);
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Active: ${user.is_active}`);
        console.log(`   - Password Hash: ${user.password_hash ? 'Present' : 'Missing'}`);
        console.log(`   - Hash Length: ${user.password_hash?.length || 0} chars`);
      });
    } else {
      console.log('❌ No users found in database!');
      console.log('\n🔧 CREATING DEFAULT USERS...');
      
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
      
      // Re-fetch users after creation
      const { data: newUsers } = await supabase
        .from('admin_users')
        .select('*');
      
      if (newUsers && newUsers.length > 0) {
        console.log('\n✅ Users created successfully!');
        users = newUsers;
      }
    }

    console.log('\n4. 🔐 PASSWORD VERIFICATION TEST:');
    
    if (users && users.length > 0) {
      const testUser = users.find(u => u.username === 'hafi') || users[0];
      console.log(`Testing password for user: ${testUser.username}`);
      
      // Test password verification
      const testPassword = 'Hantu@112233';
      const isValid = await bcrypt.compare(testPassword, testUser.password_hash);
      
      console.log(`Password "${testPassword}":`, isValid ? '✅ VALID' : '❌ INVALID');
      
      if (!isValid) {
        console.log('\n🔄 FIXING PASSWORD HASH...');
        const newHash = await bcrypt.hash(testPassword, 12);
        
        const { error } = await supabase
          .from('admin_users')
          .update({ password_hash: newHash })
          .eq('username', testUser.username);
        
        if (error) {
          console.error('❌ Error updating password:', error);
        } else {
          console.log('✅ Password hash updated successfully');
          
          // Test again
          const { data: updatedUser } = await supabase
            .from('admin_users')
            .select('password_hash')
            .eq('username', testUser.username)
            .single();
          
          if (updatedUser) {
            const isValidNow = await bcrypt.compare(testPassword, updatedUser.password_hash);
            console.log('Password verification after update:', isValidNow ? '✅ VALID' : '❌ STILL INVALID');
          }
        }
      }
    }

    console.log('\n5. 🔒 SECURITY POLICIES CHECK:');
    
    // Check RLS status
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            schemaname,
            tablename,
            rowsecurity,
            CASE 
              WHEN rowsecurity THEN 'SECURED'
              ELSE 'UNSECURED'
            END as security_status
          FROM pg_tables 
          WHERE tablename IN ('admin_users', 'admin_sessions', 'admin_activity_logs')
          ORDER BY tablename;
        `
      });
    
    if (rlsError) {
      console.log('⚠️ Could not check RLS status:', rlsError.message);
    } else if (rlsStatus) {
      console.log('RLS Status:', rlsStatus);
    }

    console.log('\n6. 🧪 AUTHENTICATION API TEST:');
    
    // Test authentication function
    const testCredentials = {
      username: 'hafi',
      password: 'Hantu@112233'
    };
    
    console.log(`Testing authentication for: ${testCredentials.username}`);
    
    const { data: authUser, error: authError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', testCredentials.username)
      .eq('is_active', true)
      .single();

    if (authError) {
      console.log('❌ Auth query error:', authError.message);
    } else if (authUser) {
      console.log('✅ User found in database');
      const passwordMatch = await bcrypt.compare(testCredentials.password, authUser.password_hash);
      console.log('Password verification:', passwordMatch ? '✅ SUCCESS' : '❌ FAILED');
    } else {
      console.log('❌ User not found');
    }

    console.log('\n🎯 SUMMARY:');
    console.log('=====================================');
    console.log('Database Connection:', testError ? '❌' : '✅');
    console.log('Users in Database:', users?.length || 0);
    console.log('Authentication Ready:', users?.length > 0 ? '✅' : '❌');
    
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('Username: hafi');
    console.log('Password: Hantu@112233');
    console.log('URL: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('\n❌ Debug failed:', error);
  }
}

debugAuth();