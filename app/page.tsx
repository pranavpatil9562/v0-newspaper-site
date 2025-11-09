import Link from "next/link"
import { getLatestNewspaper } from "@/lib/supabase/newspapers"
import { Button } from "@/components/ui/button"
import NewspaperGallery from "@/components/newspaper-gallery"
import NewspaperHeader from "@/components/newspaper-header"

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const newspaper = await getLatestNewspaper()

  if (!newspaper) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          <NewspaperHeader />
        </div>
        <div className="text-center mt-12">
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
      <NewspaperHeader />

      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {new Date(newspaper.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <Link href="/archive">
            <Button variant="ghost">Archive</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-2">{newspaper.title}</h2>
          <NewspaperGallery images={newspaper.image_urls} />
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div className="border-r border-foreground/20 pr-8">
              <p className="text-xs text-muted-foreground">© 2025 MANIKYADA MINCHU</p>
            </div>
            <div className="pl-8">
              <p className="text-xs text-muted-foreground">© 2025 ಮಣಿಕ್ಯದ ಮಿಂಚು</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
