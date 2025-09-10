import { Button, Input, Overlay, Text } from "@rneui/themed";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import {
    addCategory,
    getCategoryById,
    getCategoryByName,
    updateCategory,
} from "@/services/categoryService";
import { useEffect, useState } from "react";
import ColorPickerComponent from "./ColorPickerComponent";

type Props = {
    visible: boolean;
    setVisible: (x: boolean) => void;
    idCategory?: string;
    setIdCategory?: (x: string) => void;
};

export default function AddCategory({
    visible,
    setVisible,
    idCategory,
    setIdCategory,
}: Props) {
    const [emptyAlert, setEmptyAlert] = useState(false);
    const [usedNameAlert, setUsedNameAlert] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [color, setColor] = useState(getRandomColor());
    const [pickingColor, setPickingColor] = useState(false);

    useEffect(() => {
        const getCategory = async () => {
            if (idCategory) {
                const data = await getCategoryById(idCategory);
                if (data) {
                    setColor(data[0].color);
                    setCategoryName(data[0].name);
                }
            }
        };
        getCategory();
    }, [idCategory]);

    function exitModal() {
        setEmptyAlert(false);
        setUsedNameAlert(false);
        setVisible(!visible);
        setCategoryName("");
        if (setIdCategory) {
            setIdCategory("");
        }
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    async function saveCategory() {
        if (categoryName == "") {
            setEmptyAlert(true);
            setUsedNameAlert(false);
            return;
        }

        if (await getCategoryByName(categoryName, idCategory)) {
            setEmptyAlert(false);
            setUsedNameAlert(true);
            return;
        }
        setEmptyAlert(false);
        if (idCategory) {
            await updateCategory(idCategory, categoryName, color);
        } else {
            await addCategory(categoryName, color);
        }
        setUsedNameAlert(false);
        setVisible(false);
    }

    const saveColor = (colorObj: string) => {
        setPickingColor(false);
        setColor(colorObj);
    };

    return (
        <>
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
                                value={categoryName}
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
        </>
    );
}

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: 24, // mai mare
        fontWeight: "bold", // bold
        color: Colors.accentPrimary, // albastru (sau ce culoare vrei)
        textAlign: "center", // centru text
        marginBottom: 15, // spațiu sub titlu
    },
    modalColor: {
        backgroundColor: Colors.card,
    },
    container: {
        width: 300, // sau flexibil cu minWidth/ maxWidth
    },
    buttonStyle: {
        backgroundColor: Colors.backgroundActive,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
    },
    containerStyle: {
        width: 175,
        marginHorizontal: 10,
        marginVertical: 10,
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
    overlayBorder: {
        backgroundColor: Colors.card, // culoarea border-ului
        borderWidth: 2, // grosimea border-ului
        borderRadius: 15, // rotunjirea colțurilor
        padding: 20, // opțional, spațiere internă
    },
    overlay: {
        borderRadius: 15,
        borderWidth: 2,
        borderColor: Colors.accentPrimary,
        backgroundColor: "white",
        padding: 20,
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
