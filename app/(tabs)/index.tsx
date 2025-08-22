import { Button } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Balance } from "@/components/Balance";

export default function HomeScreen() {
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
                />
            </View>
            <Balance />
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
        marginTop: 20,
        flexDirection: "row", // pe orizontală
        justifyContent: "space-between", // unul la stânga, altul la dreapta
        paddingHorizontal: 10, // ca să nu lipească butoanele de margine
    },
});
