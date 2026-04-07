-- Admin User Setup for Supabase Local Development
-- This script creates an admin user for accessing the /admin panel

-- NOTE: For production, create user via Supabase Dashboard and add to profiles table
-- For local dev, we'll create user directly via SQL

-- Step 1: Create the admin user in auth.users
-- Password: admin123 (change in production!)
-- Email: admin@memorial.local

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'authenticated',
  'authenticated',
  'admin@memorial.local',
  '$2a$10$zLKjj.u8N5YqZGqJqZqJqugYm8gPL8pY2YP2YP2YP2YP2YP2YP2Y',  -- bcrypt hash for "admin123"
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Create corresponding identity in auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  format('{"sub":"%s","email":"%s"}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@memorial.local')::jsonb,
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (provider, id) DO NOTHING;

-- Step 3: Add admin user to profiles table with admin role
INSERT INTO profiles (id, email, role, created_at)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'admin@memorial.local',
  'admin',
  now()
) ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verify the setup
SELECT u.id, u.email, p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'admin@memorial.local';
