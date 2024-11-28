"use server";

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./notifications";
// import { Category } from "@/app/admin/categories/categories.types";


export async function getOrdersWithProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("order")
    .select("*, order_items:order_item(*, product(*)), user(*)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function updateOrderStatus(orderId: number, status: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("order")
    .update({ status })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;

  if (userId) await sendNotification(userId, status);

  revalidatePath("admin/orders");
}

export const getMonthlyOrders = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("order").select("created_at");

  if (error) throw new Error(error.message);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const ordersByMonth = data.reduce(
    (acc: Record<string, number>, order: { created_at: string }) => {
      const month = new Date(order.created_at).getUTCMonth();
      const monthName = monthNames[month];
      // Increment the count for the month
      if (!acc[monthName]) acc[monthName] = 0;
      acc[monthName]++;
      return acc;
    },
    {}
  );

  return Object.keys(ordersByMonth).map((month) => ({
    name: month,
    orders: ordersByMonth[month],
  }));
};

export const getCategoryData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category")
    .select("name, products:product(id)");

  if (error) throw new Error(error.message);

  const categoryData = data.map(
    (category: { name: string; products: { id: number }[] }) => ({
      name: category.name,
      products: category.products.length,
    })
  );

  return categoryData;
};
