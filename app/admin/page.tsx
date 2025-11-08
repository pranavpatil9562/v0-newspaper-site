import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminPanel from "@/components/admin-panel"

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/admin/login")
  }

  return <AdminPanel userId={data.user.id} />
}
