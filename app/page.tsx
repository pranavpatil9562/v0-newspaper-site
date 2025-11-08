import Link from "next/link"
import { getLatestNewspaper } from "@/lib/supabase/newspapers"
import { Button } from "@/components/ui/button"
import NewspaperGallery from "@/components/newspaper-gallery"

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const newspaper = await getLatestNewspaper()

  if (!newspaper) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-balance">MANIKAYDA MINCHU</h1>
          <p className="mt-2 text-sm text-muted-foreground">Editor: MANIKESH PATIL</p>
          <p className="mt-4 text-lg text-muted-foreground">No newspaper published yet. Check back soon!</p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/archive">
              <Button variant="outline">View Archive</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">MANIKAYDA MINCHU</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-muted-foreground">Editor: MANIKESH PATIL</p>
              <span className="text-sm text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">
                Published on{" "}
                {new Date(newspaper.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/archive">
              <Button variant="ghost">Archive</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-2">{newspaper.title}</h2>
          <NewspaperGallery images={newspaper.image_urls} />
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MANIKAYDA MINCHU. All rights reserved.</p>
          <p className="mt-2 text-xs">Editor: MANIKESH PATIL</p>
        </div>
      </footer>
    </div>
  )
}
