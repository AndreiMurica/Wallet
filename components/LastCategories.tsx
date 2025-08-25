import { getAllCategories } from "@/services/categoryService";
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import CategoryField from "./CategoryField";

type Props = {
    setId: (x: string) => void;
};

export default function LastCategories({ setId }: Props) {
    const [categories, setCategories] = useState<any[] | null>([]);
    const [selected, setSelected] = useState<any | null>(null);

    const select = (obj: any) => {
        setSelected(obj);
        setId(obj.Id);
    };
    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);
    return (
        <View style={styles.container}>
            {selected ? (
                <View style={styles.selectedContainer}>
                    <CategoryField
                        key={selected.id}
                        color={selected.color}
                        name={selected.name}
                        id={selected.id}
                        newWidth={300}
                    />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.scrollContent}
                >
                    {categories?.map((categorie) => (
                        <TouchableOpacity
                            onPress={() => setSelected(categorie)}
                        >
                            <CategoryField
                                key={categorie.id}
                                color={categorie.color}
                                name={categorie.name}
                                id={categorie.id}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginBottom: 10,
    },
    scrollContent: {
        flexDirection: "row",
        gap: 10, // spațiu între categorii (merge pe RN 0.71+)
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    selectedContainer: {
        width: "100%",
        alignItems: "center", // centrează pe orizontal
        justifyContent: "center", // centrează pe vertical (dacă vrei)
    },
});
