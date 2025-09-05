import { AddPayment } from "@/components/AddPayment";
import { Colors } from "@/constants/Colors";
import { getAllPaymentsGrouped, Payment } from "@/services/paymentService";
import { formatDateList } from "@/utils/formatDate";
import { Card, Icon } from "@rneui/base";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentsScreen() {
    const router = useRouter();
    const [groupedPayments, setGroupedPayments] = useState<Record<
        string,
        { total: number; transactions: Payment[] }
    > | null>(null);
    const [editIdPayment, setEditIdPayment] = useState("");
    const [paymentModal, setPaymentModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPaymentsGrouped();
            setGroupedPayments(data);
        };
        fetchData();
    }, [refresh]);

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/(tabs)")}>
                    <Text>
                        <Icon name="arrow-back" size={24} color="white" />
                    </Text>
                </TouchableOpacity>
                <Text style={styles.title}>All Payments</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView>
                <View style={styles.container}>
                    {groupedPayments &&
                        Object.entries(groupedPayments).map((data) => {
                            return (
                                <View key={data[0]}>
                                    <View style={styles.dataTotal}>
                                        <Text style={styles.text}>
                                            {formatDateList(data[0])}
                                        </Text>
                                        <Text style={styles.text}>
                                            {data[1].total}
                                        </Text>
                                    </View>
                                    <Card containerStyle={styles.card}>
                                        {data[1].transactions.map(
                                            (transaction, x) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={transaction.id}
                                                        onPress={() => {
                                                            setPaymentModal(
                                                                true
                                                            );
                                                            setEditIdPayment(
                                                                transaction.id
                                                            );
                                                        }}
                                                    >
                                                        <View
                                                            key={transaction.id}
                                                            style={[
                                                                styles.itemRow,
                                                                x ==
                                                                    data[1]
                                                                        .transactions
                                                                        .length -
                                                                        1 && {
                                                                    borderBottomWidth: 0,
                                                                },
                                                            ]}
                                                        >
                                                            <View
                                                                style={
                                                                    styles.categoryContainer
                                                                }
                                                            >
                                                                <View
                                                                    style={[
                                                                        styles.circle,
                                                                        {
                                                                            backgroundColor:
                                                                                transaction
                                                                                    .category
                                                                                    .color,
                                                                        },
                                                                    ]}
                                                                />
                                                                <View
                                                                    style={
                                                                        styles.categoryTextContainer
                                                                    }
                                                                >
                                                                    <Text
                                                                        style={
                                                                            styles.text
                                                                        }
                                                                    >
                                                                        {
                                                                            transaction
                                                                                .category
                                                                                .name
                                                                        }
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <Text
                                                                style={
                                                                    styles.amount
                                                                }
                                                            >
                                                                {
                                                                    transaction.amount
                                                                }{" "}
                                                                RON
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            }
                                        )}
                                    </Card>
                                </View>
                            );
                        })}
                    {editIdPayment && (
                        <AddPayment
                            paymentModal={paymentModal}
                            setPaymentModal={setPaymentModal}
                            idPayment={editIdPayment}
                            refresh={refresh}
                            setRefresh={setRefresh}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.card,
    },
    header: {
        height: 60,
        backgroundColor: Colors.card, // culoarea dorită
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
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
    dataTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", // pentru aliniere verticală
        paddingTop: 15,
        paddingHorizontal: 20,
        color: Colors.textPrimary,
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
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        borderColor: Colors.textSecondary,
        borderWidth: 1,
    },
    categoryContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    card: {
        backgroundColor: Colors.backgroundActive,
        borderWidth: 0,
        borderRadius: 15,
    },
});
