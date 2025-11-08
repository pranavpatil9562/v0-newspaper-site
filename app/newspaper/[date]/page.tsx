import Link from "next/link"
import { notFound } from "next/navigation"
import { getNewspaperByDate } from "@/lib/supabase/newspapers"
import { Button } from "@/components/ui/button"
import NewspaperGallery from "@/components/newspaper-gallery"
import { ChevronLeft } from "lucide-react"

export const revalidate = 3600 // Revalidate every hour

interface PageProps {
  params: Promise<{
    date: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const { date } = await params

  return {
    title: `MANIKYADA MINCHU - ${date}`,
    description: `MANIKYADA MINCHU newspaper from ${date}`,
  }
}

export default async function NewspaperPage({ params }: PageProps) {
  const { date } = await params

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound()
  }

  const newspaper = await getNewspaperByDate(date)

  if (!newspaper) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/archive">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Archive
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{newspaper.title}</h1>
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
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <NewspaperGallery images={newspaper.image_urls} />
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MANIKYADA MINCHU. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
