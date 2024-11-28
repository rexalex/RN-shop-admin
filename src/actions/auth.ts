'use server';

import { createClient } from '@/supabase/server';

export const authenticate = async (email: string, password: string) => {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  } catch (error) {
    console.log('AUTHENTICATION ERROR', error);
    throw error;
  }
};

export const getLatestUsers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("email, created_at, id")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw new Error(`Error fetching latest users: ${error.message}`);

  const latestUsers = data.map(
    (user: { email: string; created_at: string | null; id: string }) => ({
      id: user.id,
      email: user.email,
      date: user.created_at,
    })
  );

  return latestUsers;
};
