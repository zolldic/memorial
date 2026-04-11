import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const email = process.argv[2] || 'admin@memorial.local';
const password = process.argv[3] || 'admin123';

if (!email || !password) {
  console.error('Usage: node supabase/create-admin-user.mjs <email> <password>');
  process.exit(1);
}

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const { data: created, error: createError } = await adminClient.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (createError && !createError.message.toLowerCase().includes('already been registered')) {
  console.error('Failed to create auth user:', createError.message);
  process.exit(1);
}

let userId = created?.user?.id;
if (!userId) {
  const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers();
  if (usersError) {
    console.error('Failed to list users:', usersError.message);
    process.exit(1);
  }
  userId = usersData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
}

if (!userId) {
  console.error('Could not resolve user ID for admin user.');
  process.exit(1);
}

const { error: profileError } = await adminClient
  .from('profiles')
  .upsert({ id: userId, email, role: 'admin' }, { onConflict: 'id' });

if (profileError) {
  console.error('Failed to upsert admin profile:', profileError.message);
  process.exit(1);
}

console.log(`Admin ready: ${email} (${userId})`);
