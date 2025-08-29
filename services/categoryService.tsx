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
