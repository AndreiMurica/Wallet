import { Colors } from "@/constants/Colors";
import { View, StyleSheet } from "react-native";
import { Text } from "@rneui/themed";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
    text: string;
    index: number;
    amount: number;
    translateX: SharedValue<number>;
};
export function BalanceWatch({ text, index, translateX, amount }: Props) {
    const rStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            translateX.value,
            [(index - 1) * 162, index * 162, (index + 1) * 162],
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
        );
        const borderRadius = interpolate(
            translateX.value,
            [(index - 1) * 162, index * 162, (index + 1) * 162],
            [0, 72, 0],
            Extrapolation.CLAMP
        );
        return {
            borderRadius,
            transform: [{ scale }],
        };
    });

    const rTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [(index - 1) * 162, index * 162, (index + 1) * 162],
            [-1, 1, -1],
            Extrapolation.CLAMP
        );
        return {
            opacity: opacity,
        };
    });

    return (
        <Animated.View
            style={[styles.balance, rStyle, index == 2 && { marginRight: 0 }]}
        >
            <Animated.View style={rTextStyle}>
                <Text style={styles.balanceText}>
                    {amount < 0 ? "Spent" : "Earned"}
                </Text>
                <Text style={styles.balanceText}>
                    {amount < 0 ? -amount : amount}
                </Text>
                <Text style={styles.balanceText}>{text}</Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    balance: {
        width: 144, // diametrul cercului
        height: 144,
        borderRadius: 72, // jumătate din lățime/înălțime → cerc
        //borderWidth: 3,
        borderColor: Colors.textPrimary,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.backgroundActive, // dacă vrei să aibă fundal
        marginLeft: 18,
    },
    balanceText: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 4,
    },
});
