"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Clip {
  clip_id: string
  title: string
  viral_score: number
  duration: number
  file_name: string
  download_url: string
}

interface ClipsDisplayProps {
  clips: Clip[]
  jobId: string
}

export default function ClipsDisplay({ clips, jobId }: ClipsDisplayProps) {
  const [downloadingClip, setDownloadingClip] = useState<string | null>(null)

  const handleDownload = async (clip: Clip) => {
    try {
      setDownloadingClip(clip.clip_id)
      const downloadUrl = `http://localhost:8000${clip.download_url}`

      // Create a temporary link and trigger download
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = clip.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setDownloadingClip(null)
    }
  }

  const getViralScoreColor = (score: number) => {
    if (score >= 8) return "text-green-300"
    if (score >= 6) return "text-blue-300"
    if (score >= 4) return "text-yellow-300"
    return "text-orange-300"
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Generated Clips</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clips.map((clip) => (
          <Card
            key={clip.clip_id}
            className="p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-white line-clamp-2">{clip.title}</h3>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-400 text-xs">Duration</p>
                    <p className="font-medium text-white">{clip.duration.toFixed(1)}s</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Viral Score</p>
                    <p className={`font-bold text-lg ${getViralScoreColor(clip.viral_score)}`}>{clip.viral_score}/10</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleDownload(clip)}
                disabled={downloadingClip === clip.clip_id}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50"
              >
                {downloadingClip === clip.clip_id ? "Downloading..." : "Download"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
