import { supabase } from "../database/supabase";

export const addPayment = async (
    category_id: string,
    date: Date,
    amount: number
) => {
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

export type Payment = {
    id: string;
    amount: number;
    date: string;
    category: {
        id: string;
        name: string;
        color: string;
    };
};

export const getAllPaymentsGrouped = async () => {
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
        .order("date", { ascending: false });

    if (error) {
        console.error(error);
        return null;
    }

    const grouped: Record<string, { total: number; transactions: Payment[] }> =
        {};

    data?.forEach((payment) => {
        const day = new Date(payment.date).toISOString().split("T")[0];

        const normalizedPayment: Payment = {
            ...payment,
            category: Array.isArray(payment.category)
                ? payment.category[0]
                : payment.category,
        };
        if (!grouped[day]) {
            grouped[day] = { total: 0, transactions: [] };
        }

        grouped[day].transactions.push(normalizedPayment);
        grouped[day].total += payment.amount;
    });

    return grouped;
};

export const getPaymentById = async (id: string) => {
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
        .eq("id", id);
    return data;
};

export const deletePaymentById = async (id: string) => {
    await supabase.from("Payments").delete().eq("id", id);
};

export const updatePaymentById = async (
    id: string,
    category_id: string,
    date: Date,
    amount: number
) => {
    await supabase
        .from("Payments")
        .update([{ category_id, date, amount }])
        .eq("id", id);
};
