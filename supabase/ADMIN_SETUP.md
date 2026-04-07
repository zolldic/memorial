# Admin User Setup

## Local Development

**Login Credentials:**
- Email: `admin@memorial.local`
- Password: `admin123`

### Creating the Admin User

Run this command to create the admin user in your local Supabase:

```bash
docker exec -i supabase_db_Memorial psql -U postgres -d postgres < supabase/create-admin-user.sql
```

This will:
1. Create the user in `auth.users` table
2. Create the corresponding identity in `auth.identities`
3. Add the user to `profiles` table with `role='admin'`

### Accessing the Admin Panel

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3001/admin`
3. If not logged in, you'll be redirected to the login page
4. Enter the credentials above
5. You'll have access to:
   - Dashboard with stats
   - Martyrs management (coming soon)
   - Pending memories review (coming soon)

## Production Setup

For production, DO NOT use the SQL script. Instead:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" or "Invite"
3. Create user with a strong password
4. Note the user's UUID
5. Manually insert into `profiles` table:

```sql
INSERT INTO profiles (id, email, role, created_at, updated_at)
VALUES (
  '<user-uuid-from-dashboard>',
  'your-admin@example.com',
  'admin',
  now(),
  now()
);
```

## Security Notes

- The local password `admin123` is for development only
- Production passwords should be strong and unique
- Consider adding 2FA for production admin accounts
- The `profiles.role` column controls admin access via RLS policies
- Only users with `role='admin'` can access protected admin features

## Troubleshooting

**Can't log in:**
- Verify user exists: `SELECT * FROM auth.users WHERE email = 'admin@memorial.local';`
- Verify profile exists: `SELECT * FROM profiles WHERE email = 'admin@memorial.local';`
- Check role: Should be `'admin'`, not `'user'`

**Access denied after login:**
- Check `profiles.role` is exactly `'admin'`
- Clear browser cookies and try again
- Check browser console for auth errors

**Password hash issues:**
- If login fails, you may need to reset the password via Supabase CLI:
  ```bash
  supabase auth update user admin@memorial.local --password admin123
  ```
