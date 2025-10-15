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
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-blue-600"
    if (score >= 4) return "text-yellow-600"
    return "text-orange-600"
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#37322F]">Generated Clips</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clips.map((clip) => (
          <Card
            key={clip.clip_id}
            className="p-4 border border-[rgba(55,50,47,0.12)] hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              {/* Clip Title */}
              <div>
                <h3 className="font-semibold text-[#37322F] line-clamp-2">{clip.title}</h3>
              </div>

              {/* Clip Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[#605A57] text-xs">Duration</p>
                    <p className="font-medium text-[#37322F]">{clip.duration.toFixed(1)}s</p>
                  </div>
                  <div>
                    <p className="text-[#605A57] text-xs">Viral Score</p>
                    <p className={`font-bold text-lg ${getViralScoreColor(clip.viral_score)}`}>{clip.viral_score}/10</p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={() => handleDownload(clip)}
                disabled={downloadingClip === clip.clip_id}
                className="w-full bg-[#37322F] hover:bg-[#322D2B] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
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
