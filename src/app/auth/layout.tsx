// TODO make sure the user is authenticated and if is admin, before rendering the layout
// TODO if user is not authenticated, return the children as is

import { ADMIN } from "@/constants/constants";
import { createClient } from "@/supabase/client";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  // console.log("authData", authData);

  if (authData?.user) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error || !data) {
      console.log("Error fetching user data", error);
      return;
    }
    if (data.type === ADMIN) return redirect("/admin");
  }
  return <>{children}</>;
}
