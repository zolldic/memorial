# Admin User Setup

## Local Development

**Login Credentials:**
- Email: `admin@memorial.local`
- Password: `admin123`

### Creating the Admin User

Run this command:

```bash
node supabase/create-admin-user.mjs admin@memorial.local admin123
```

This creates (or reuses) the auth user and ensures the profile role is `admin`.

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

For production, create the auth user in Supabase first, then grant the admin role in `profiles`.

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" or "Invite"
3. Create user with a strong password
4. Note the user's UUID
5. Manually insert into `profiles` table:

```sql
INSERT INTO profiles (id, email, role, created_at)
VALUES (
  'YOUR_USER_ID',
  'your-admin@example.com',
  'admin',
  now()
) ON CONFLICT (id) DO UPDATE SET role = 'admin';
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

**Password issues:**
- Re-run the setup script:
  ```bash
  node supabase/create-admin-user.mjs admin@memorial.local admin123
  ```
