import { View, StyleSheet } from "react-native";
import { Text } from "@rneui/themed";
import { Colors } from "@/constants/Colors";
export function Balance() {
    return (
        <View style={styles.balanceContainer}>
            <View style={styles.balance}>
                <Text style={styles.balanceText}>Balanta ta este </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    balanceContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center", // centrează pe orizontală
        alignItems: "center", // centrează pe verticală
        marginTop: 40,
    },
    balance: {
        width: 150, // diametrul cercului
        height: 150,
        borderRadius: 75, // jumătate din lățime/înălțime → cerc
        borderWidth: 3,
        borderColor: Colors.textPrimary,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.accentLight, // dacă vrei să aibă fundal
    },
    balanceText: {
        color: Colors.card,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
