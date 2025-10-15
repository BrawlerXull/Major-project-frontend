"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface JobStatusTrackerProps {
  job: any
}

export default function JobStatusTracker({ job }: JobStatusTrackerProps) {
  const [currentJob, setCurrentJob] = useState(job)
  const [isPolling, setIsPolling] = useState(job.status === "processing" || job.status === "pending")

  useEffect(() => {
    if (!isPolling) return

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/jobs/${job.job_id}`)
        if (response.ok) {
          const data = await response.json()
          setCurrentJob(data)

          // Stop polling if job is completed or failed
          if (data.status === "completed" || data.status === "failed") {
            setIsPolling(false)
          }
        }
      } catch (error) {
        console.error("Failed to fetch job status:", error)
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [job.job_id, isPolling])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/30"
      case "processing":
        return "bg-blue-500/10 border-blue-500/30"
      case "failed":
        return "bg-red-500/10 border-red-500/30"
      default:
        return "bg-white/5 border-white/10"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-300"
      case "processing":
        return "text-blue-300"
      case "failed":
        return "text-red-300"
      default:
        return "text-gray-300"
    }
  }

  return (
    <Card className={`p-6 border ${getStatusColor(currentJob.status)} bg-white/5 backdrop-blur-sm`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Job Status</h3>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${getStatusTextColor(currentJob.status)}`}>
              {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
            </span>
            {currentJob.status === "processing" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-300">Processing...</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">Progress</p>
          <p className="text-white font-medium">{currentJob.progress}</p>
        </div>

        {currentJob.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
            <p className="text-red-300 text-sm">
              <strong>Error:</strong> {currentJob.error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Created</p>
            <p className="text-sm font-medium text-white">{new Date(currentJob.created_at).toLocaleString()}</p>
          </div>
          {currentJob.completed_at && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Completed</p>
              <p className="text-sm font-medium text-white">{new Date(currentJob.completed_at).toLocaleString()}</p>
            </div>
          )}
        </div>

        {currentJob.clips && currentJob.clips.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm font-medium text-white">
              ✓ {currentJob.clips.length} clip{currentJob.clips.length !== 1 ? "s" : ""} generated
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
