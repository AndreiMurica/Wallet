import { Colors } from "@/constants/Colors";
import { Icon } from "@rneui/base";
import { useRouter } from "expo-router";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";

export default function PaymentsScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>All Payments</Text>
                <View style={{ width: 24 }} /> {/* Spacer pentru echilibru */}
            </View>
            <View style={styles.container}>
                {/* aici pui lista completă */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundActive,
        padding: 20,
    },
    header: {
        height: 60,
        backgroundColor: Colors.backgroundActive, // culoarea dorită
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 15, // pentru status bar
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    content: {
        flex: 1,
        padding: 20,
    },
});
