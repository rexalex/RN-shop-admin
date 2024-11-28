import React from "react";
import PageComponent from "./page-component";
import { getCategoryData, getMonthlyOrders } from "@/actions/orders";
import { getLatestUsers } from "@/actions/auth";

async function AdminDashboard() {
  const monthlyOrders = await getMonthlyOrders();
  const categoryData = await getCategoryData();
  const latestUsers = await getLatestUsers();
  
  return <PageComponent {...{monthlyOrders, categoryData, latestUsers}}/>;
}

export default AdminDashboard;
