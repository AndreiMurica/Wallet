import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Button, ButtonGroup, Input, Overlay, Text } from "@rneui/themed";

import { Dropdown } from "react-native-element-dropdown";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllCategoriesAndPayments } from "@/services/categoryService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import AddCategory from "@/components/AddCategory";
import { useFocusEffect } from "expo-router";

export default function Categories() {
    const [categories, setCategories] = useState<any[] | []>([]);
    const [orderCondition, setOrderCondition] = useState(1);
    const [editingCategoryId, setEditingCategoryId] = useState("");
    const [visible, setVisible] = useState(false);

    const insets = useSafeAreaInsets();

    useEffect(() => {
        const getAllCategories = async () => {
            const data = await getAllCategoriesAndPayments();
            setCategories(data);
        };
        if (!visible) getAllCategories();
    }, [visible]);

    useFocusEffect(
        useCallback(() => {
            const getAllCategories = async () => {
                const data = await getAllCategoriesAndPayments();
                setCategories(data);
            };
            getAllCategories();
        }, [])
    );

    useEffect(() => {
        let sorted = [...categories];
        switch (orderCondition) {
            case 1:
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 2:
                sorted.sort((a, b) => {
                    if (a.total_payments == b.total_payments) {
                        return a.total_amount - b.total_amount;
                    }
                    return a.total_payments - b.total_payments;
                });
                break;
            case 3:
                sorted.sort((a, b) => {
                    if (a.total_payments == b.total_payments) {
                        return a.total_amount - b.total_amount;
                    }
                    return b.total_payments - a.total_payments;
                });
                break;
            case 4:
                sorted.sort((a, b) => b.total_amount - a.total_amount);
                break;
            case 5:
                sorted.sort((a, b) => a.total_amount - b.total_amount);
                break;
        }
        setCategories(sorted);
    }, [orderCondition]);

    const orderOption = [
        { label: "Asc. by name", value: 1 },
        { label: "Asc. by payments number", value: 2 },
        { label: "Desc. by payments number", value: 3 },
        { label: "Asc. by payments value", value: 4 },
        { label: "Desc. by payments value", value: 5 },
    ];

    return (
        <>
            <View style={[{ paddingTop: insets.top, flex: 1 }]}>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Order:</Text>
                    <Dropdown
                        style={styles.dropdownRow}
                        data={orderOption}
                        labelField="label"
                        valueField="value"
                        selectedTextProps={{
                            style: { color: Colors.textPrimary, fontSize: 20 }, // culoarea textului selectat
                        }}
                        value={orderCondition}
                        onChange={(item) => setOrderCondition(item.value)}
                        itemTextStyle={{ color: Colors.textPrimary }} // culoarea opțiunilor
                        renderItem={(item) => (
                            <Text
                                style={{
                                    padding: 12,
                                    color: Colors.textPrimary,
                                    backgroundColor: Colors.backgroundActive, // fundal pentru fiecare item
                                }}
                            >
                                {item.label}
                            </Text>
                        )}
                        itemContainerStyle={{ borderWidth: 0 }}
                        containerStyle={{
                            borderWidth: 0,
                            backgroundColor: "rgba(0,0,0,0.9)",
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                            overflow: "hidden",
                        }}
                    />
                    <Button
                        icon={{
                            name: "plus",
                            type: "font-awesome",
                            size: 15,
                            color: Colors.textPrimary,
                        }}
                        iconContainerStyle={{ marginLeft: 0, marginRight: 0 }}
                        titleStyle={{ fontWeight: "700" }}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={[
                            styles.containerStyle,
                            { alignSelf: "flex-start" },
                        ]}
                    />
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                        {categories ? (
                            categories.map((category, x) => (
                                <TouchableOpacity
                                    key={category.id}
                                    onPress={() => {
                                        setEditingCategoryId(category.id);
                                        setVisible(true);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.itemRow,
                                            x == categories.length - 1 && {
                                                borderBottomWidth: 0,
                                            },
                                        ]}
                                    >
                                        <View style={styles.categoryContainer}>
                                            <View
                                                style={[
                                                    styles.circle,
                                                    {
                                                        backgroundColor:
                                                            category.color,
                                                    },
                                                ]}
                                            />
                                            <View
                                                style={
                                                    styles.categoryTextContainer
                                                }
                                            >
                                                <Text style={styles.text}>
                                                    {category.name}
                                                </Text>
                                                <Text style={styles.date}>
                                                    {category.total_payments}{" "}
                                                    payments
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.amount}>
                                            {category.total_amount} RON
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <></>
                        )}
                    </View>
                </ScrollView>
                <AddCategory
                    visible={visible}
                    setVisible={setVisible}
                    idCategory={editingCategoryId}
                    setIdCategory={setEditingCategoryId}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10, // spațiu între elemente
        flexWrap: "wrap", // să nu depășească ecranul pe mobil
        marginHorizontal: 10,
        marginVertical: 10,
        fontSize: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: "600",
        color: Colors.textPrimary,
    },
    dropdownRow: {
        flex: 1,
        height: 50,
        borderRadius: 30,
        paddingRight: 12,
        borderWidth: 0,
    },
    buttonStyle: {
        backgroundColor: Colors.backgroundActive,
        borderRadius: 25, // jumătate din width/height => cerc
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    containerStyle: {
        // containerul butonului
        marginHorizontal: 0,
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
    date: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
