import { Button, ButtonGroup, Input, Overlay, Text } from "@rneui/themed";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Balance } from "@/components/Balance";
import { useEffect, useState } from "react";
import ColorPickerComponent from "@/components/ColorPickerComponent";
import { ColorFormatsObject } from "reanimated-color-picker";
import { addCategory, getCategoryByName } from "@/services/categoryService";
import NumericPad from "@/components/NumericPad";
import LastCategories from "@/components/LastCategories";
import DateInput from "@/components/DateInput";
import { addPayment } from "@/services/paymentService";
import PaymentsList from "@/components/PaymentsList";

export default function HomeScreen() {
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState(getRandomColor());
    const [categoryName, setCategoryName] = useState("");
    const [pickingColor, setPickingColor] = useState(false);
    const [emptyAlert, setEmptyAlert] = useState(false);
    const [usedNameAlert, setUsedNameAlert] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [amount, setAmount] = useState("-");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [checkForSave, setCheckForSave] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (isAmountSeted() && selectedCategory) {
            setCheckForSave(true);
        } else {
            setCheckForSave(false);
        }
    }, [amount, selectedCategory]);

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

    const closePaymentModal = () => {
        setPaymentModal(false);
        setAmount("-");
        setSelectedCategory(null);
    };

    const savePayment = async () => {
        await addPayment(selectedCategory!, date, getFormattedAmount());
        debugger;
        closePaymentModal();
        debugger;
        setRefresh(!refresh);
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
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    function exitModal() {
        setEmptyAlert(false);
        setUsedNameAlert(false);
        setVisible(!visible);
        setCategoryName("");
    }

    const saveColor = (colorObj: string) => {
        setPickingColor(false);
        setColor(colorObj);
    };

    const numpadEdit = (number: string) => {
        let newAmount;
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

    async function saveCategory() {
        if (categoryName == "") {
            setEmptyAlert(true);
            setUsedNameAlert(false);
            return;
        }
        let name = categoryName.toLowerCase();
        name[0].toUpperCase();
        if (await getCategoryByName(name)) {
            setEmptyAlert(false);
            setUsedNameAlert(true);
            return;
        }
        setEmptyAlert(false);
        await addCategory(name, color);
    }

    return (
        <>
            <View style={styles.containerButtons}>
                <Button
                    title="Adauga categorie"
                    icon={{
                        name: "plus",
                        type: "font-awesome",
                        size: 15,
                        color: Colors.textPrimary,
                    }}
                    iconContainerStyle={{ marginRight: 10 }}
                    titleStyle={{ fontWeight: "700" }}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={[
                        styles.containerStyle,
                        { alignSelf: "flex-start" },
                    ]}
                    onPress={() => setVisible(!visible)}
                />
                <Button
                    title="Adauga plata"
                    icon={{
                        name: "money",
                        type: "font-awesome",
                        size: 15,
                        color: Colors.textPrimary,
                    }}
                    iconContainerStyle={{ marginRight: 10 }}
                    titleStyle={{ fontWeight: "700" }}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={[
                        styles.containerStyle,
                        { alignSelf: "flex-end" },
                    ]}
                    onPress={() => setPaymentModal(true)}
                />

                <Overlay
                    isVisible={visible}
                    onBackdropPress={exitModal}
                    overlayStyle={styles.overlayBorder}
                    animationType="fade"
                >
                    <View style={styles.container}>
                        <Text style={styles.title}>Adauga o categorie</Text>

                        <View style={styles.row}>
                            <TouchableOpacity
                                onPress={() => setPickingColor(true)}
                                style={styles.colorPickerContainer}
                            >
                                <View
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: color },
                                    ]}
                                />
                                <Text style={styles.colorText}>Set color</Text>
                            </TouchableOpacity>

                            <View style={{ flex: 1 }}>
                                <Input
                                    placeholder="Category name"
                                    onChangeText={setCategoryName}
                                    containerStyle={styles.inputContainer}
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.textPrimary}
                                />
                                {emptyAlert && (
                                    <Text style={styles.alert}>
                                        Category name is mandatory
                                    </Text>
                                )}
                                {usedNameAlert && (
                                    <Text style={styles.alert}>
                                        Category already exists
                                    </Text>
                                )}
                            </View>
                        </View>

                        <Button
                            onPress={saveCategory}
                            buttonStyle={styles.saveButton}
                            title="Save category"
                        />
                    </View>
                </Overlay>

                <Overlay
                    isVisible={pickingColor}
                    onBackdropPress={() => setPickingColor(false)}
                    overlayStyle={styles.overlayBorder}
                    animationType="fade"
                >
                    <View style={styles.modalColor}>
                        <Text style={styles.modalTitle}>Pick a color</Text>
                        <ColorPickerComponent color={color} save={saveColor} />
                    </View>
                </Overlay>

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
                            setId={(id) => {
                                setSelectedCategory(id);
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
                        <DateInput passDate={setDate} />
                        <NumericPad onPress={(x) => numpadEdit(x)} />
                        <Button
                            title="Save"
                            onPress={(index) => savePayment()}
                            disabled={!checkForSave}
                            buttonStyle={[styles.saveButton, { margin: 10 }]}
                        />
                    </View>
                </Overlay>
            </View>
            <Balance />
            <PaymentsList refresh={refresh} />
        </>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
    buttonStyle: {
        backgroundColor: Colors.accentPrimary,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
    },
    containerStyle: {
        width: 175,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    containerButtons: {
        marginTop: 50,
        flexDirection: "row", // pe orizontală
        justifyContent: "space-between", // unul la stânga, altul la dreapta
        paddingHorizontal: 10, // ca să nu lipească butoanele de margine
    },
    colorCircle: {
        width: 50, // diametrul cercului
        height: 50,
        borderRadius: 25, // jumătate din lățime/înălțime → cerc
        borderWidth: 3,
        borderColor: Colors.accentPrimary,
        justifyContent: "center",
        alignItems: "center",
    },
    modalColor: {
        backgroundColor: Colors.card,
    },
    overlayBorder: {
        backgroundColor: Colors.card, // culoarea border-ului
        borderWidth: 2, // grosimea border-ului
        borderRadius: 15, // rotunjirea colțurilor
        padding: 20, // opțional, spațiere internă
    },
    modalTitle: {
        fontSize: 24, // mai mare
        fontWeight: "bold", // bold
        color: Colors.accentPrimary, // albastru (sau ce culoare vrei)
        textAlign: "center", // centru text
        marginBottom: 15, // spațiu sub titlu
    },
    overlay: {
        borderRadius: 15,
        borderWidth: 2,
        borderColor: Colors.accentPrimary,
        backgroundColor: "white",
        padding: 20,
    },
    container: {
        width: 300, // sau flexibil cu minWidth/ maxWidth
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
        color: Colors.accentPrimary,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    colorPickerContainer: {
        alignItems: "center",
        marginRight: 12,
    },
    colorText: {
        marginTop: 4,
        fontSize: 12,
        textAlign: "center",
        color: Colors.textSecondary,
    },
    inputContainer: {
        flex: 1,
        //width: 200,
    },
    inputText: {
        color: Colors.textPrimary,
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: Colors.accentPrimary,
        borderRadius: 8,
        paddingVertical: 10,
    },
    alert: {
        color: "red",
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
