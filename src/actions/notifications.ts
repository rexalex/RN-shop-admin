"use server";
import { createClient } from "@/supabase/server";


async function sendPushNotification({
  expoPushToken,
  title,
  body,
}: {
  expoPushToken: string;
  title: string;
  body: string;
}) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { data: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function getUserNotificationToken(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("expo_notification_token")
    .eq("id", userId)
    .single();
  if (error) throw new Error(error.message);

  return data;
}

export const sendNotification = async (userId: string, status: string) => {
  const tokenData = await getUserNotificationToken(userId);

  if (!tokenData.expo_notification_token) return;

  await sendPushNotification({
    expoPushToken: tokenData.expo_notification_token,
    title: "Status Update", 
    body: `Your order status is now ${status} 🚀`,
  });
};
