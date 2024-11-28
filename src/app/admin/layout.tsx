import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RenderMounted } from "@/components/render-mounted";
import { ADMIN } from "@/constants/constants";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
// import { revalidatePath } from 'next/cache'

// revalidatePath('/', 'layout')

export default async function RootLayout({
  children,
}: Readonly<{ children?: ReactNode }>) {
  // TODO: check if user is logged in and admin before rendering this page
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();

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
    // why redirect to itself?
    if (data.type === ADMIN) return redirect("/");
  }
  return (
    <RenderMounted>
      <Header />
      <main className="min-h-[calc(100svh-128px)] py-3">{children}</main>
      <Footer />
    </RenderMounted>
  );
}
