import React, { useState } from "react";
import { View, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Input } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { formatDateEU } from "@/utils/formatDate";

type Props = {
    passDate: (date: Date) => void;
};

export default function DateInput({ passDate }: Props) {
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState(false);

    const handleChange = (event: any, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) {
            setDate(selectedDate);
            passDate(selectedDate);
        }
    };

    return (
        <TouchableOpacity onPress={() => setShow(true)} style={styles.layer}>
            <View style={styles.container}>
                <Input
                    leftIcon={{
                        name: "calendar",
                        type: "entypo",
                        size: 30,
                        color: Colors.textPrimary,
                        containerStyle: styles.icon,
                    }}
                    placeholder="Select date"
                    editable={false}
                    value={formatDateEU(date)}
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.inputInnerContainer}
                    inputStyle={styles.inputText}
                    placeholderTextColor={Colors.textPrimary}
                />

                {show && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleChange}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center", // vertical centrat
        //marginVertical: 10,
    },
    icon: {
        marginLeft: 15,
        textAlign: "center",
        // Pentru a centra vertical icon-ul față de input-ul de 50px
        paddingVertical: 5,
    },
    inputContainer: {
        flex: 1,
        marginTop: 10,
    },
    inputInnerContainer: {
        borderWidth: 1,
        borderColor: Colors.textPrimary,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: "center", // text centrat vertical
    },
    inputText: {
        textAlign: "center",
        fontSize: 16,
        color: Colors.textPrimary,
    },
    layer: {
        margin: 0,
    },
});
