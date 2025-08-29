import { Button, ButtonGroup, Input, Overlay, Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Balance } from "@/components/Balance";
import { useEffect, useState } from "react";
import ColorPickerComponent from "@/components/ColorPickerComponent";
import { addCategory, getCategoryByName } from "@/services/categoryService";
import NumericPad from "@/components/NumericPad";
import LastCategories from "@/components/LastCategories";
import DateInput from "@/components/DateInput";
import { addPayment } from "@/services/paymentService";
import PaymentsList from "@/components/PaymentsList";
import { AddPayment } from "@/components/AddPayment";

export default function HomeScreen() {
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState(getRandomColor());
    const [categoryName, setCategoryName] = useState("");
    const [pickingColor, setPickingColor] = useState(false);
    const [emptyAlert, setEmptyAlert] = useState(false);
    const [usedNameAlert, setUsedNameAlert] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);

    const [refresh, setRefresh] = useState(false);

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

    async function saveCategory() {
        if (categoryName == "") {
            setEmptyAlert(true);
            setUsedNameAlert(false);
            return;
        }
        if (await getCategoryByName(categoryName)) {
            setEmptyAlert(false);
            setUsedNameAlert(true);
            return;
        }
        setEmptyAlert(false);
        await addCategory(categoryName, color);
        setUsedNameAlert(false);
        setVisible(false);
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
                <AddPayment
                    paymentModal={paymentModal}
                    setPaymentModal={setPaymentModal}
                    refresh={refresh}
                    setRefresh={setRefresh}
                />
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
});
