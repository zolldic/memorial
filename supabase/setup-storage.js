// Setup storage buckets for local Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function setupStorage() {
  console.log('🗄️  Setting up storage buckets...\n');

  // Create buckets
  const buckets = [
    { name: 'memory-photos', public: true, fileSizeLimit: 5242880, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
    { name: 'memory-audio', public: true, fileSizeLimit: 10485760, allowedMimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/webm', 'audio/wav'] },
    { name: 'martyr-images', public: true, fileSizeLimit: 5242880, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] }
  ];

  for (const bucket of buckets) {
    console.log(`Creating bucket: ${bucket.name}...`);
    const { data, error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
      allowedMimeTypes: bucket.allowedMimeTypes
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`  ✓ Bucket ${bucket.name} already exists`);
      } else {
        console.error(`  ✗ Error creating ${bucket.name}:`, error.message);
      }
    } else {
      console.log(`  ✓ Created ${bucket.name}`);
    }
  }

  console.log('\n✅ Storage setup complete!');
  console.log('📦 Buckets created: memory-photos, memory-audio, martyr-images');
}

setupStorage().catch(console.error);
