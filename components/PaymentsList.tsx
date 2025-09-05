import { Colors } from "@/constants/Colors";
import { getLastPayments } from "@/services/paymentService";
import { formatDateEU, formatDateList } from "@/utils/formatDate";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@rneui/base";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    View,
    Text,
    StyleSheet,
    PanResponder,
    Dimensions,
    TouchableOpacity,
} from "react-native";

const { height } = Dimensions.get("window");

type Category = {
    id: string;
    name: string;
    color: string;
};

type Payment = {
    id: string;
    amount: number;
    date: Date;
    category: Category;
};

export default function PaymentsList({ refresh }: { refresh: boolean }) {
    const [lastPayments, setLastPayment] = useState<Payment[] | null>(null);

    const router = useRouter();
    useEffect(() => {
        const getPayments = async () => {
            const last = await getLastPayments(3);
            setLastPayment(last);
        };
        getPayments();
    }, [refresh]);

    return (
        <Card containerStyle={styles.card}>
            {/* <View style={styles.handle}></View> */}

            <TouchableOpacity onPress={() => router.push("/PaymentsScreen")}>
                <Text style={styles.title}>See all payments</Text>
            </TouchableOpacity>

            {lastPayments &&
                lastPayments.map((payment, x) => (
                    <View
                        key={payment.id}
                        style={[
                            styles.itemRow,
                            x == 2 && { borderBottomWidth: 0 },
                        ]}
                    >
                        <View style={styles.categoryContainer}>
                            <View
                                style={[
                                    styles.circle,
                                    { backgroundColor: payment.category.color },
                                ]}
                            />
                            <View style={styles.categoryTextContainer}>
                                <Text style={styles.text}>
                                    {payment.category.name}
                                </Text>
                                <Text style={styles.date}>
                                    {formatDateList(String(payment.date))}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.amount}>{payment.amount} RON</Text>
                    </View>
                ))}
        </Card>
    );
}

const styles = StyleSheet.create({
    bottomSheet: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#aaa",
        alignSelf: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        textAlign: "center",
        color: Colors.textPrimary,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    card: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        margin: 0, // elimină marginile implicite
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: Colors.backgroundActive,
        padding: 20,
        borderWidth: 0,
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        borderColor: Colors.textSecondary,
        borderWidth: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: "500",
        color: Colors.textPrimary,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.textPrimary,
    },

    categoryContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    amount: {
        fontSize: 18,
        fontWeight: "500",
        color: Colors.textPrimary,
    },
    categoryTextContainer: {
        flexDirection: "column",
        alignItems: "flex-start", // textul aliniat stânga lângă cerc
    },

    date: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
