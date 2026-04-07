# Supabase Storage Setup Instructions

## Create Storage Buckets

Go to: https://supabase.com/dashboard/project/nqudpmqqoocydrzryzrl/storage/buckets

### 1. **memory-photos** Bucket
- Click **New bucket**
- Name: `memory-photos`
- Public bucket: ✅ **Check this** (photos need to be publicly accessible)
- File size limit: `5 MB`
- Allowed MIME types: `image/jpeg, image/png, image/webp`
- Click **Create bucket**

### 2. **memory-audio** Bucket
- Click **New bucket**
- Name: `memory-audio`
- Public bucket: ✅ **Check this**
- File size limit: `10 MB`
- Allowed MIME types: `audio/mpeg, audio/mp4, audio/webm, audio/wav`
- Click **Create bucket**

### 3. **martyr-images** Bucket
- Click **New bucket**
- Name: `martyr-images`
- Public bucket: ✅ **Check this**
- File size limit: `5 MB`
- Allowed MIME types: `image/jpeg, image/png, image/webp`
- Click **Create bucket**

## Configure Bucket Policies

For each bucket, click the bucket name → **Policies** tab → **New policy**

### For all three buckets, create these policies:

#### Policy 1: Public Read Access
```sql
-- Name: Anyone can view files
-- Operation: SELECT
CREATE POLICY "Anyone can view files"
ON storage.objects FOR SELECT
USING (bucket_id = 'BUCKET_NAME_HERE');
```
Replace `BUCKET_NAME_HERE` with: `memory-photos`, `memory-audio`, or `martyr-images`

#### Policy 2: Authenticated Upload (for memory-photos and memory-audio)
```sql
-- Name: Anyone can upload files
-- Operation: INSERT
CREATE POLICY "Anyone can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'BUCKET_NAME_HERE');
```

#### Policy 3: Admin Only Upload (for martyr-images)
```sql
-- Name: Only admins can upload
-- Operation: INSERT
CREATE POLICY "Only admins can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'martyr-images' AND
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
```

#### Policy 4: Admin Delete (all buckets)
```sql
-- Name: Admins can delete files
-- Operation: DELETE
CREATE POLICY "Admins can delete files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'BUCKET_NAME_HERE' AND
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
```

## Verify Setup

After creating buckets and policies:
1. Go to each bucket
2. Try uploading a test file (should work)
3. Note the public URL format: `https://nqudpmqqoocydrzryzrl.supabase.co/storage/v1/object/public/BUCKET_NAME/FILE_PATH`

## ✅ Complete!
Once buckets are created, continue with the backend implementation.
