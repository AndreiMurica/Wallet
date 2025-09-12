import {
    Button,
    ButtonGroup,
    CheckBox,
    Input,
    Overlay,
    Text,
} from "@rneui/themed";
import { TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import NumericPad from "@/components/NumericPad";
import LastCategories from "@/components/LastCategories";
import DateInput from "@/components/DateInput";
import {
    addPayment,
    deletePaymentById,
    getPaymentById,
    Payment,
    updatePaymentById,
} from "@/services/paymentService";
import { useEffect, useState } from "react";
import { Category } from "@/constants/Types";
import { getAllCategories } from "@/services/categoryService";
import { color } from "@rneui/base";

type Props = {
    modal: boolean;
    setModal: (x: boolean) => void;
    all?: boolean;
    setAll?: (x: boolean) => void;
    selectedList?: string[];
    setSelectedList?: (x: string[]) => void;
};

export function SelectCategoriesForStats({
    modal,
    setModal,
    all,
    setAll,
    selectedList,
    setSelectedList,
}: Props) {
    const [checkedList, setCheckedList] = useState<boolean[] | []>([]);
    const [categoryList, setCategoryList] = useState<Category[] | []>([]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [amount, setAmount] = useState("-");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        null
    );
    const [checkForSave, setCheckForSave] = useState(false);
    const [date, setDate] = useState<Date>(new Date());

    useEffect(() => {
        const getCategories = async () => {
            let data = await getAllCategories();
            let list: boolean[] = [];
            let categories: Category[] = [];
            data?.sort((a, b) => a.name.localeCompare(b.name));
            data?.forEach((category, index) => {
                categories.push({
                    id: category.id,
                    color: category.color,
                    name: category.name,
                });
                if (selectedList?.find(category.id) || all == true) {
                    list.push(true);
                } else {
                    list.push(false);
                }
            });
            setCheckedList(list);
            setCategoryList(categories);
        };
        getCategories();
    }, [modal]);

    const closePaymentModal = () => {
        setModal(false);
    };

    const toogleCheckBox = (index: number) => {
        let list = checkedList;
        list[index] = !list[index];
        setCheckedList(list);
    };
    return (
        <Overlay
            isVisible={modal}
            overlayStyle={styles.overlayPayment}
            animationType="fade"
            onBackdropPress={() => closePaymentModal()}
        >
            <ScrollView>
                {categoryList.map((category, x) => {
                    return (
                        <View key={category.id}>
                            <CheckBox
                                checked={checkedList[x]}
                                onPress={() => toogleCheckBox(x)}
                                containerStyle={{
                                    backgroundColor: "transparent",
                                }}
                                title={
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
                                            style={styles.categoryTextContainer}
                                        >
                                            <Text style={styles.text}>
                                                {category.name}
                                            </Text>
                                        </View>
                                    </View>
                                }
                            />
                        </View>
                    );
                })}
            </ScrollView>

            <View style={styles.overlayContainer}>
                <Button
                    title="Save"
                    //onPress={() => savePayment()}
                    buttonStyle={[styles.saveButton, { margin: 10 }]}
                />
            </View>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: Colors.accentPrimary,
        borderRadius: 8,
        paddingVertical: 10,
    },
    overlayPayment: {
        backgroundColor: Colors.card,
        borderWidth: 2,
        borderRadius: 15,
        padding: 0,
        width: 320, // ajustați după nevoie
        overflow: "visible",
    },
    overlayContainer: {
        padding: 0,
        position: "relative", // ca să putem poziționa butonul de close absolut
    },
    categoryContainer: {
        flexDirection: "row",
        alignItems: "center",
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
    categoryTextContainer: {
        flexDirection: "column",
        alignItems: "flex-start", // textul aliniat stânga lângă cerc
    },
});
