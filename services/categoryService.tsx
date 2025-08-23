import { supabase } from "../database/supabase";

export const addCategory = async (name: string, color: string) => {
    color.toLowerCase();
    color[0].toUpperCase();
    const { data, error } = await supabase
        .from("Categories")
        .insert([{ name, color }])
        .select();
};

export const getCategoryByName = async (name: string) => {
    const data = await supabase.from("Categories").select().eq("name", name);
    if (data) {
        return true;
    }
};
