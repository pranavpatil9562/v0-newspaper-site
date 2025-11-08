import { createClient } from "./server"

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("admin_users").select("id").eq("id", userId).single()

  return !error && !!data
}

export async function getAdminUser(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("admin_users").select("*").eq("id", userId).single()

  if (error) {
    return null
  }

  return data
}
