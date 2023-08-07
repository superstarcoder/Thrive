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

const supabaseUrl = "https://yzbfybzztgrtnagvvmzv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YmZ5Ynp6dGdydG5hZ3Z2bXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExNzQxMDcsImV4cCI6MjAwNjc1MDEwN30.Yyja16-OfD98Z37i25zO5YSMOFqK6N4ZVQpuUETPQfE"

export const supabase = createClient("https://yzbfybzztgrtnagvvmzv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YmZ5Ynp6dGdydG5hZ3Z2bXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExNzQxMDcsImV4cCI6MjAwNjc1MDEwN30.Yyja16-OfD98Z37i25zO5YSMOFqK6N4ZVQpuUETPQfE"
 , {auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }},
);