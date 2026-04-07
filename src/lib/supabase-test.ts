// Quick test to verify Supabase connection
// Run this in browser console or create a test page

import { supabase } from './supabase';

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    // Test 1: Check if client is initialized
    console.log('✅ Supabase client initialized');
    
    // Test 2: Try to fetch from a table
    const { data, error } = await supabase
      .from('martyrs')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching from database:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to database');
    console.log('📊 Sample data:', data);
    
    // Test 3: Check storage buckets
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketError) {
      console.error('❌ Error fetching buckets:', bucketError.message);
    } else {
      console.log('✅ Storage buckets:', buckets.map(b => b.name));
    }
    
    console.log('🎉 Supabase connection test passed!');
    return true;
    
  } catch (err) {
    console.error('❌ Connection test failed:', err);
    return false;
  }
}

// Uncomment to run test immediately
// testSupabaseConnection();
