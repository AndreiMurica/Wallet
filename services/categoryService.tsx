import { supabase } from "../database/supabase";

export const addCategory = async (name: string, color: string) => {
    await supabase.from("Categories").insert([{ name, color }]);
};

export const updateCategory = async (
    id: string,
    name: string,
    color: string
) => {
    await supabase.from("Categories").update([{ name, color }]).eq("id", id);
};

export const getCategoryByName = async (name: string, id?: string) => {
    const { data, error } = await supabase
        .from("Categories")
        .select()
        .eq("name", name);
    if (id) {
        if (data && data.length > 0 && data[0].id != id) {
            return true;
        } else {
            return false;
        }
    }
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

export const getCategoryById = async (id: string) => {
    const { data, error } = await supabase
        .from("Categories")
        .select()
        .eq("id", id);
    return data;
};
