# Supabase Setup Guide

## 🎯 Quick Start - 3 Steps

### Step 1: Run Database Schema ✅
1. Open: https://supabase.com/dashboard/project/nqudpmqqoocydrzryzrl/sql
2. Click **SQL Editor** → **New query**
3. Copy/paste contents from `supabase/schema.sql`
4. Click **Run**
5. Verify: Should see "Memorial database schema created successfully!"

### Step 2: Run RLS Policies ✅
1. In the same SQL Editor, click **New query**
2. Copy/paste contents from `supabase/rls-policies.sql`
3. Click **Run**
4. Verify: Should see "RLS policies created successfully!"

### Step 3: Create Storage Buckets ✅
Follow the detailed instructions in `supabase/STORAGE_SETUP.md`

## 📊 What Gets Created

### Database Tables (6)
- `profiles` - Admin user management
- `martyrs` - Core martyr data
- `martyr_translations` - Bilingual content (en/ar)
- `memories` - User submissions with moderation
- `memory_translations` - Bilingual memory content
- `candle_events` - Track candle lighting

### Storage Buckets (3)
- `memory-photos` - User-uploaded photos (5MB limit)
- `memory-audio` - User-recorded audio (10MB limit)
- `martyr-images` - Martyr profile images (admin only)

### Security Features
✅ Row Level Security (RLS) enabled on all tables
✅ Public can read approved content only
✅ Admins can moderate and manage all content
✅ Users can submit memories (pending approval)
✅ Anyone can light candles

## 🔑 Create Admin Account

After running the schema, you need to create your admin account:

### Option 1: Via Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/nqudpmqqoocydrzryzrl/auth/users
2. Click **Add user** → **Create new user**
3. Enter your email and password
4. Click **Create user**
5. Copy the user's UUID from the users list

### Option 2: Via SQL (After creating user in dashboard)
Run this SQL (replace YOUR_USER_ID with the UUID from step 5):

```sql
INSERT INTO profiles (id, email, role)
VALUES ('YOUR_USER_ID', 'your-email@example.com', 'admin');
```

## ✅ Verification Checklist

After completing all steps:

- [ ] All 6 tables exist in Database → Tables
- [ ] RLS is enabled (shield icon on tables)
- [ ] 3 storage buckets exist in Storage → Buckets
- [ ] Admin user created in Authentication → Users
- [ ] Admin profile exists in profiles table
- [ ] Can view schema in SQL Editor

## 🚀 Next Steps

Once Supabase is fully set up:
1. Backend will be ready to use
2. Continue with data migration (move mock data to Supabase)
3. Update frontend services to use Supabase
4. Build admin dashboard

## 📝 Connection Info

Your project is already configured in `.env.local`:
- Project URL: https://nqudpmqqoocydrzryzrl.supabase.co
- Anon Key: ✅ Already configured

## 🆘 Troubleshooting

**Error: relation "profiles" does not exist**
→ Run schema.sql first

**Error: policy already exists**
→ Safe to ignore, policies are idempotent

**Can't create buckets**
→ Check you're in Storage → Buckets section

**RLS blocking queries**
→ Create admin account and profile first

Need help? Let me know which step you're stuck on!
