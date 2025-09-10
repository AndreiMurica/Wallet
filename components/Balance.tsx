import { View, StyleSheet } from "react-native";
import { Text } from "@rneui/themed";
import { Colors } from "@/constants/Colors";
import { OpacitySlider } from "reanimated-color-picker";
import { useEffect, useState } from "react";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import { BalanceWatch } from "./BalanceWatch";
import {
    getSpentAllTime,
    getSpentThisMonth,
    getSpentThisYear,
} from "@/services/paymentService";
export function Balance() {
    const [index, setIndex] = useState(0);
    const [content, setContent] = useState<any[] | []>([]);

    const translateX = useSharedValue(0);

    useEffect(() => {
        const getSpentAmounts = async () => {
            let content2 = [];
            const thisMonth = await getSpentThisMonth();
            const thisYear = await getSpentThisYear();
            const allTime = await getSpentAllTime();
            content2.push({
                amount: thisMonth,
                text: "this month",
            });
            content2.push({
                amount: thisYear,
                text: "this year",
            });
            content2.push({
                amount: allTime,
                text: "in total",
            });
            setContent(content2);
        };
        getSpentAmounts();
    }, []);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        translateX.value = event.contentOffset.x;
    });

    return (
        <View style={styles.balanceContainer}>
            <View style={styles.balance}>
                <View style={{ width: 180 }}>
                    <Animated.ScrollView
                        pagingEnabled
                        style={{ width: 162 }}
                        horizontal
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                    >
                        {content &&
                            content.map((x, index) => {
                                return (
                                    <BalanceWatch
                                        key={index}
                                        amount={x.amount}
                                        text={x.text}
                                        index={index}
                                        translateX={translateX}
                                    />
                                );
                            })}
                    </Animated.ScrollView>
                </View>
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
        // justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.card, // dacă vrei să aibă fundal
        marginRight: 50,
        marginLeft: 50,
    },
    balanceText: {
        color: Colors.card,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
