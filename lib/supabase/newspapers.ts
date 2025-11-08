import { createClient as createServerClient } from "./server"

export async function getLatestNewspaper() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("newspapers").select("*").order("date", { ascending: false }).limit(1)

  if (error) {
    return null
  }

  return data && data.length > 0 ? data[0] : null
}

export async function getNewspaperByDate(date: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("newspapers").select("*").eq("date", date).limit(1)

  if (error) {
    return null
  }

  return data && data.length > 0 ? data[0] : null
}

export async function getArchiveNewspapers(days = 30) {
  const supabase = await createServerClient()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days)

  const { data, error } = await supabase
    .from("newspapers")
    .select("date, title")
    .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: false })

  if (error) {
    return []
  }

  return data || []
}

export async function deleteOldNewspapers(days = 30) {
  const supabase = await createServerClient()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days)

  const { error } = await supabase.from("newspapers").delete().lt("date", thirtyDaysAgo.toISOString().split("T")[0])

  return { error }
}
