import 'react-native-url-polyfill/auto'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

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

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY
 , {auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }},
);