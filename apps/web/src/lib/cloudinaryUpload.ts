/**
 * Upload a file to Cloudinary via the /api/cloudinary/upload route.
 * Returns the secure file URL on success, or null on error.
 */
export async function uploadFileToCloudinary(file: File, folder: string): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    if (folder) formData.append("folder", folder)

    const res = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    if (!res.ok || !data?.url) {
      console.error("Cloudinary upload failed:", data?.error || res.statusText)
      return null
    }

    return data.url as string
  } catch (error) {
    console.error("Cloudinary Upload Error:", error instanceof Error ? error.message : error)
    return null
  }
}
