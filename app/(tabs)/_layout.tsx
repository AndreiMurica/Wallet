import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
    return (
        <View style={styles.container}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors.accentPrimary, // culoarea tab activ
                    tabBarInactiveTintColor: Colors.textSecondary, // culoarea tab inactiv
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarActiveBackgroundColor: Colors.backgroundActive,
                    tabBarInactiveBackgroundColor: Colors.card,
                    tabBarBackground: TabBarBackground,
                    sceneStyle: { backgroundColor: Colors.background },
                    tabBarStyle: Platform.select({
                        ios: {
                            // Use a transparent background on iOS to show the blur effect
                            position: "absolute",
                        },
                        default: {},
                    }),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color }) => (
                            <IconSymbol
                                size={28}
                                name="house.fill"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="categories"
                    options={{
                        title: "Categories",
                        tabBarIcon: ({ color }) => (
                            <IconSymbol
                                size={28}
                                name="paperplane.fill"
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background, // background general dark
    },
});
