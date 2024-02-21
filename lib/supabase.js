import 'react-native-url-polyfill/auto'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient("https://nhwwuiyymezanynnctiu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5od3d1aXl5bWV6YW55bm5jdGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE4MDY0NDMsImV4cCI6MjAwNzM4MjQ0M30.vxlxQHk-qbkBPj3GqQJTKfBi4ZM48ukwyFS2VUQN_Sc"
 , {auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }},
);