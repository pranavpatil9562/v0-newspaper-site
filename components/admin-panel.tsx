"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, LogOut, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import FileUploadZone from "./file-upload-zone"

interface AdminPanelProps {
  userId: string
}

export default function AdminPanel({ userId }: AdminPanelProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [deleteDate, setDeleteDate] = useState("")
  const [deleting, setDeleting] = useState(false)

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles])
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError("Please enter a newspaper title")
      return
    }

    if (files.length === 0) {
      setError("Please select at least one image")
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const imageUrls: string[] = []

      // Upload each file to Supabase Storage
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileName = `${date}_${i + 1}_${Date.now()}.jpg`
        const path = `newspapers/${date}/${fileName}`

        const { data, error: uploadError } = await supabase.storage
          .from("newspapers")
          .upload(path, file, { upsert: false })

        if (uploadError) throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)

        const { data: publicUrl } = supabase.storage.from("newspapers").getPublicUrl(data.path)
        imageUrls.push(publicUrl.publicUrl)
      }

      // Check if newspaper already exists for this date
      const { data: existingNewspaper, error: checkError } = await supabase
        .from("newspapers")
        .select("*")
        .eq("date", date)
        .single()

      let dbError
      if (checkError?.code === "PGRST116") {
        // No existing newspaper, create new one
        const { error } = await supabase.from("newspapers").insert({
          date,
          title,
          image_urls: imageUrls,
        })
        dbError = error
      } else if (!checkError) {
        // Newspaper exists, append images
        const updatedUrls = [...(existingNewspaper.image_urls || []), ...imageUrls]
        const { error } = await supabase
          .from("newspapers")
          .update({
            title,
            image_urls: updatedUrls,
          })
          .eq("date", date)
        dbError = error
      } else {
        throw checkError
      }

      if (dbError) throw dbError

      setSuccess(`Successfully uploaded ${files.length} image(s) for ${date}`)
      setTitle("")
      setDate(new Date().toISOString().split("T")[0])
      setFiles([])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDate) {
      alert("Please enter a date to delete (YYYY-MM-DD)")
      return
    }

    const confirmDelete = confirm(`Are you sure you want to delete the newspaper for ${deleteDate}?`)
    if (!confirmDelete) return

    setDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()

      // Delete from database
      const { error: dbError } = await supabase.from("newspapers").delete().eq("date", deleteDate)
      if (dbError) throw dbError

      // Optional: delete from storage (entire folder)
      await supabase.storage.from("newspapers").remove([`newspapers/${deleteDate}`])

      setSuccess(`Newspaper for ${deleteDate} deleted successfully`)
      setDeleteDate("")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete newspaper")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">MANIKYADA MINCHU Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage newspaper uploads</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Newspaper Pages</CardTitle>
            <CardDescription>Upload JPG images for today's newspaper edition</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="date">Publication Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Newspaper Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., MANIKYADA MINCHU - Nov 8, 2025"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Upload Pages (JPG files)</Label>
                <FileUploadZone onFilesSelected={handleFilesSelected} />
              </div>

              {files.length > 0 && (
                <div className="grid gap-2">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

              {success && (
                <div className="p-4 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <Button type="submit" disabled={uploading || files.length === 0} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                {uploading
                  ? `Uploading... (${files.length} file${files.length !== 1 ? "s" : ""})`
                  : `Upload ${files.length} Image${files.length !== 1 ? "s" : ""}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Delete Section */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Newspaper
            </CardTitle>
            <CardDescription>Remove a newspaper record and its images by date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 items-end">
              <div className="grid gap-2">
                <Label htmlFor="deleteDate">Publication Date</Label>
                <Input
                  id="deleteDate"
                  type="date"
                  value={deleteDate}
                  onChange={(e) => setDeleteDate(e.target.value)}
                />
              </div>
              <Button
                variant="destructive"
                disabled={deleting || !deleteDate}
                onClick={handleDelete}
                className="w-full md:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? "Deleting..." : "Delete Newspaper"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
