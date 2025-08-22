import Auth from "@/components/Auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { supabase } from "../database/supabase.js";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [session, setSession] = useState<Session | null>(null);
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }
    return (
        <>
            <StatusBar style="light" />
            {session && session.user ? (
                <>
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
                </>
            ) : (
                <Auth />
            )}
        </>
    );
}
