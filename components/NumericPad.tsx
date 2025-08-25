import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useState } from "react";

const numpad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "⌫"],
];

export default function NumericPad({
    onPress,
}: {
    onPress: (val: string) => void;
}) {
    const [pressedNum, setPressedNum] = useState<string | null>(null);
    return (
        <View style={styles.container}>
            {numpad.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPressIn={() => setPressedNum(num)}
                            onPressOut={() => setPressedNum(null)}
                            style={[
                                styles.button,
                                {
                                    backgroundColor:
                                        pressedNum == num
                                            ? "#ccc" // culoare apăsată
                                            : Colors.backgroundActive, // default
                                },
                            ]}
                            onPress={() => onPress(num)}
                        >
                            <Text style={styles.buttonText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card, // griul dorit
        padding: 10,
        borderRadius: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        aspectRatio: 1, // pătrat
        backgroundColor: Colors.backgroundActive,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.textPrimary,
    },
});
