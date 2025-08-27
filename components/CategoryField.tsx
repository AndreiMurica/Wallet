import { Colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";

type Props = {
    id?: string;
    color: string;
    name: string;
    newWidth?: number;
};

export default function CategoryField({ id, color, name, newWidth }: Props) {
    return (
        <View
            style={[styles.container, newWidth?.valueOf && { width: newWidth }]}
            key={id}
        >
            <View style={[styles.circle, { backgroundColor: color }]} />
            <Text style={styles.text}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.backgroundActive, // oval background
        borderRadius: 25, // mare ca să fie oval
        paddingVertical: 8,
        width: 200,
        paddingHorizontal: 15,
        marginVertical: 5,
        justifyContent: "center", // centrează vertical
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 10,
        borderColor: Colors.textSecondary,
        borderWidth: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: "500",
        color: Colors.textPrimary,
    },
});
