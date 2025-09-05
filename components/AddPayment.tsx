import { Button, ButtonGroup, Input, Overlay, Text } from "@rneui/themed";
import { TouchableOpacity, View, StyleSheet } from "react-native";
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

type Props = {
    paymentModal: boolean;
    setPaymentModal: (x: boolean) => void;
    refresh?: boolean;
    setRefresh?: (x: boolean) => void;
    idPayment?: string;
};

export function AddPayment({
    paymentModal,
    setPaymentModal,
    refresh,
    setRefresh,
    idPayment,
}: Props) {
    //const [paymentModal, setPaymentModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [amount, setAmount] = useState("-");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        null
    );
    const [checkForSave, setCheckForSave] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [paymentCategory, setPaymentCategory] = useState<Category | null>(
        null
    );

    useEffect(() => {
        const setValues = async () => {
            if (idPayment) {
                const data = await getPaymentById(idPayment);
                if (data) {
                    if (data[0].amount > 0) {
                        setAmount("+" + String(data[0].amount));
                    }
                    setAmount(String(data[0].amount));
                    setPaymentCategory(
                        Array.isArray(data[0].category)
                            ? data[0].category[0]
                            : data[0].category
                    );
                    setSelectedCategoryId(data[0].category.id);
                    setDate(new Date(data[0].date));
                }
            }
        };
        setValues();
    }, [idPayment, paymentModal]);

    useEffect(() => {
        if (isAmountSeted() && selectedCategoryId) {
            setCheckForSave(true);
        } else {
            setCheckForSave(false);
        }
    }, [amount, selectedCategoryId]);

    const closePaymentModal = () => {
        setPaymentModal(false);
        setAmount("-");
        setSelectedCategoryId(null);
    };

    const numpadEdit = (number: string) => {
        if (number == "⌫") {
            if (amount.length > 1) {
                setAmount(amount.slice(0, -1));
            }
        } else {
            if (number == ".") {
                if (amount.includes(".")) {
                    return;
                }
                if (amount.length == 1) {
                    setAmount(amount + "0.");
                } else setAmount(amount + ".");
            } else {
                if (amount.length == 2 && amount[1] == "0") {
                    setAmount(amount.slice(0, -1) + number);
                } else setAmount(amount + number);
            }
        }
    };

    const changeTab = (index: number) => {
        setSelectedIndex(index);
        if (index == 1) {
            let newAmount = "+" + amount.slice(1);
            setAmount(newAmount);
        } else {
            let newAmount = "-" + amount.slice(1);
            setAmount(newAmount);
        }
    };

    const deletePayment = () => {
        if (idPayment) {
            deletePaymentById(idPayment);
        }
        closePaymentModal();
        if (setRefresh) {
            console.log(refresh);
            setRefresh(!refresh);
        }
    };

    const savePayment = async () => {
        if (idPayment) {
            await updatePaymentById(
                idPayment,
                selectedCategoryId!,
                date,
                getFormattedAmount()
            );
        } else {
            await addPayment(selectedCategoryId!, date, getFormattedAmount());
        }
        closePaymentModal();
        if (setRefresh) {
            setRefresh(!refresh);
        }
    };

    const getFormattedAmount = () => {
        if (!amount || amount === "+" || amount === "-") return 0;
        const cleaned = amount.startsWith("+") ? amount.slice(1) : amount;
        return parseFloat(cleaned);
    };

    const isAmountSeted = () => {
        if (getFormattedAmount() != 0) {
            return true;
        }
        return false;
    };
    return (
        <Overlay
            isVisible={paymentModal}
            overlayStyle={styles.overlayPayment}
            animationType="fade"
            onBackdropPress={() => closePaymentModal()}
        >
            <View style={styles.overlayContainer}>
                {/* Close button */}
                <TouchableOpacity
                    onPress={() => closePaymentModal()}
                    style={styles.closeButtonTopRight}
                >
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                {/* Content */}
                <ButtonGroup
                    buttons={["Paid", "Earned"]}
                    selectedIndex={selectedIndex}
                    onPress={(index) => changeTab(index)}
                    selectedButtonStyle={{
                        backgroundColor: Colors.accentPrimary,
                    }}
                    buttonStyle={{
                        backgroundColor: Colors.accentLight,
                    }}
                    containerStyle={styles.buttonGroupFullWidth}
                />
                <LastCategories
                    paymentCategory={paymentCategory}
                    setId={(id) => {
                        setSelectedCategoryId(id);
                    }}
                />
                <Input
                    placeholder="Amount"
                    value={amount}
                    editable={false}
                    placeholderTextColor={Colors.textPrimary}
                    inputStyle={[
                        {
                            textAlign: "center",
                            fontSize: 26,
                        },
                        {
                            color: selectedIndex == 0 ? "red" : "green",
                        },
                    ]}
                />
                <DateInput passDate={setDate} oldDate={date} />
                <NumericPad onPress={(x) => numpadEdit(x)} />
                <Button
                    title="Save"
                    onPress={() => savePayment()}
                    disabled={!checkForSave}
                    buttonStyle={[styles.saveButton, { margin: 10 }]}
                />
                {paymentCategory && (
                    <Button
                        title="Delete"
                        buttonStyle={[
                            styles.saveButton,
                            { margin: 10, backgroundColor: "red" },
                        ]}
                        onPress={() => deletePayment()}
                    />
                )}
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
    closeButtonTopRight: {
        position: "absolute",
        top: -15,
        right: -15,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        overflow: "visible",
    },
    closeText: {
        fontSize: 18,
        color: "white",
    },
    buttonGroupFullWidth: {
        width: "100%",
        marginBottom: 20,
        marginTop: 0,
        marginRight: 0,
        marginLeft: 0,
        borderTopLeftRadius: 15, // colțul stânga sus
        borderTopRightRadius: 15, // colțul dreapta sus
        overflow: "hidden",
    },
});
