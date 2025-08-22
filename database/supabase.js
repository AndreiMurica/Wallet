import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://viwswweqmykzdumgbjgq.supabase.co"; // înlocuiește cu Project URL
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpd3N3d2VxbXlremR1bWdiamdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTcwMzcsImV4cCI6MjA3MTQzMzAzN30.fuY1bn5_sSpLU04N-kvJaL-93h3D0c-o9TmYpas3cC0"; // înlocuiește cu anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock,
    },
});

if (Platform.OS !== "web") {
    AppState.addEventListener("change", (state) => {
        if (state === "active") {
            supabase.auth.startAutoRefresh();
        } else {
            supabase.auth.stopAutoRefresh();
        }
    });
}
