import { supabase } from "../database/supabase";

export const addPayment = async (
    category_id: string,
    date: Date,
    amount: number
) => {
    debugger;
    console.log(date);
    await supabase
        .from("Payments")
        .insert([{ category_id, date, amount }])
        .select();
};

export const getLastPayments = async (number: number) => {
    const { data, error } = await supabase
        .from("Payments")
        .select(
            `
        id,
        amount,
        date,
        category:Categories ( id, name, color )
        `
        )
        .order("date", { ascending: false })
        .limit(number);
    const formatted =
        data?.map((p) => ({
            ...p,
            category: p.category,
        })) ?? null;
    return formatted;
};
