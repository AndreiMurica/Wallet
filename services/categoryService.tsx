import { supabase } from "../database/supabase";

export const addCategory = async (name: string, color: string) => {
    await supabase.from("Categories").insert([{ name, color }]).select();
};

export const getCategoryByName = async (name: string) => {
    const { data, error } = await supabase
        .from("Categories")
        .select()
        .eq("name", name);
    if (data && data.length > 0) {
        return true;
    }
    return false;
};

export const getAllCategories = async () => {
    const { data, error } = await supabase.from("Categories").select();
    return data;
};

export const getAllCategoriesAndPayments = async () => {
    const { data, error } = await supabase.rpc(
        "get_all_categories_and_payments"
    );

    if (error) {
        console.error("Error fetching categories and payments:", error);
        return [];
    }

    return data;
};
