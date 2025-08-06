/**
 * Fix All User Passwords
 * Update password hash for all users
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAllPasswords() {
  console.log('🔧 Fixing all user passwords...');
  
  const users = [
    { username: 'hafi', password: 'Hantu@112233' },
    { username: 'nandika', password: 'Hantu@112233' }
  ];
  
  for (const user of users) {
    console.log(`\n👤 Updating password for: ${user.username}`);
    
    // Generate new hash
    const newHash = await bcrypt.hash(user.password, 12);
    console.log(`New hash length: ${newHash.length} chars`);
    
    // Update in database
    const { error } = await supabase
      .from('admin_users')
      .update({ password_hash: newHash })
      .eq('username', user.username);
    
    if (error) {
      console.error(`❌ Error updating ${user.username}:`, error);
    } else {
      console.log(`✅ Password updated for ${user.username}`);
      
      // Verify the update
      const { data: updatedUser } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('username', user.username)
        .single();
      
      if (updatedUser) {
        const isValid = await bcrypt.compare(user.password, updatedUser.password_hash);
        console.log(`Verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      }
    }
  }
  
  console.log('\n🎉 All passwords updated!');
  console.log('\n📋 LOGIN CREDENTIALS:');
  console.log('Username: hafi | Password: Hantu@112233');
  console.log('Username: nandika | Password: Hantu@112233');
  console.log('\n🔗 Login URL: http://localhost:3000/admin/login');
}

fixAllPasswords();