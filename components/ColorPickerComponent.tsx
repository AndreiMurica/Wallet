import { Colors } from "@/constants/Colors";
import { Button, Input, Overlay, Text } from "@rneui/themed";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ColorPicker, {
    ColorFormatsObject,
    colorKit,
    HueSlider,
    OpacitySlider,
    Panel1,
    PreviewText,
    Swatches,
} from "reanimated-color-picker";

const customSwatches = new Array(6)
    .fill("#fff")
    .map(() => colorKit.randomRgbColor().hex());

type Props = {
    color: string;
    save: (color: string) => void;
};

export default function ColorPickerComponent({ color, save }: Props) {
    const [pickedColor, setPickedColor] = useState(color);

    return (
        <ColorPicker
            value={pickedColor}
            sliderThickness={25}
            thumbSize={24}
            thumbShape="circle"
            onCompleteJS={(obj) => setPickedColor(obj.hex)}
            style={styles.picker}
            boundedThumb
        >
            <Panel1 style={styles.panelStyle} />
            <HueSlider style={styles.sliderStyle} />
            <OpacitySlider style={styles.sliderStyle} />

            <Swatches
                style={styles.swatchesContainer}
                swatchStyle={styles.swatchStyle}
                colors={customSwatches}
            />

            <Button
                buttonStyle={{ backgroundColor: Colors.accentPrimary }}
                title={"Save"}
                onPress={() => save(pickedColor)}
            />
        </ColorPicker>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontFamily: "Quicksand",
        fontWeight: "bold",
        marginVertical: 20,
    },
    picker: {
        gap: 20,
    },
    pickerContainer: {
        alignSelf: "center",
        width: 300,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    panelStyle: {
        borderRadius: 16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    sliderStyle: {
        borderRadius: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    sliderVerticalStyle: {
        borderRadius: 20,
        height: 300,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    sliderTitle: {
        color: "#000",
        fontWeight: "bold",
        marginBottom: 5,
        paddingHorizontal: 4,
        fontFamily: "Quicksand",
    },
    previewStyle: {
        height: 40,
        borderRadius: 14,
    },
    previewTxt: {
        color: "#707070",
        fontFamily: "Quicksand",
    },
    inputStyle: {
        color: "#707070",
        paddingVertical: 2,
        borderColor: "#707070",
        fontSize: 12,
        marginLeft: 5,
    },
    swatchesContainer: {
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 10,
    },
    swatchStyle: {
        borderRadius: 20,
        height: 30,
        width: 30,
        margin: 0,
        marginBottom: 0,
        marginHorizontal: 0,
        marginVertical: 0,
    },
});
