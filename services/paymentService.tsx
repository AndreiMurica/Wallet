import { supabase } from "../database/supabase";

export const addPayment = async (
    category_id: string,
    date: Date,
    amount: number
) => {
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

export const getSpentThisMonth = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
        .from("Payments")
        .select("amount")
        .gte("date", startOfMonth.toISOString())
        .lte("date", endOfMonth.toISOString());

    if (!data) return 0;

    const total = data.reduce((sum, payment) => sum + payment.amount, 0);
    return total;
};

export const getSpentThisYear = async () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const { data, error } = await supabase
        .from("Payments")
        .select("amount")
        .gte("date", startOfYear.toISOString());

    if (!data) return 0;

    const total = data.reduce((sum, payment) => sum + payment.amount, 0);
    return total;
};

export const getSpentAllTime = async () => {
    const { data, error } = await supabase.from("Payments").select("amount");

    if (!data) return 0;

    const total = data.reduce((sum, payment) => sum + payment.amount, 0);
    return total;
};
