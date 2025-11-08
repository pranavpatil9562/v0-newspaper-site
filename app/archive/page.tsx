import Link from "next/link"
import { getArchiveNewspapers } from "@/lib/supabase/newspapers"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export const revalidate = 3600 // Revalidate every hour

export default async function ArchivePage() {
  const newspapers = await getArchiveNewspapers(30)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Daily Times</h1>
            <p className="text-sm text-muted-foreground">Archive</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Newspaper Archive</h2>
            <p className="text-muted-foreground">Browse issues from the past 30 days</p>
          </div>

          {newspapers.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No newspapers in the archive yet.</p>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newspapers.map((newspaper) => (
                <Link key={newspaper.date} href={`/newspaper/${newspaper.date}`}>
                  <div className="group border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">
                        {newspaper.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(newspaper.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="mt-4 inline-block text-sm text-primary group-hover:underline">Read →</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Daily Times. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
