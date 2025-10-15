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
        return "bg-green-50 border-green-200"
      case "processing":
        return "bg-blue-50 border-blue-200"
      case "failed":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-800"
      case "processing":
        return "text-blue-800"
      case "failed":
        return "text-red-800"
      default:
        return "text-gray-800"
    }
  }

  return (
    <Card className={`p-6 border ${getStatusColor(currentJob.status)}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[#37322F] mb-2">Job Status</h3>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${getStatusTextColor(currentJob.status)}`}>
              {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
            </span>
            {currentJob.status === "processing" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-700">Processing...</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-[#605A57] mb-2">Progress</p>
          <p className="text-[#37322F] font-medium">{currentJob.progress}</p>
        </div>

        {currentJob.error && (
          <div className="bg-red-100 border border-red-300 rounded p-3">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {currentJob.error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-current border-opacity-10">
          <div>
            <p className="text-xs text-[#605A57] uppercase tracking-wide">Created</p>
            <p className="text-sm font-medium text-[#37322F]">{new Date(currentJob.created_at).toLocaleString()}</p>
          </div>
          {currentJob.completed_at && (
            <div>
              <p className="text-xs text-[#605A57] uppercase tracking-wide">Completed</p>
              <p className="text-sm font-medium text-[#37322F]">{new Date(currentJob.completed_at).toLocaleString()}</p>
            </div>
          )}
        </div>

        {currentJob.clips && currentJob.clips.length > 0 && (
          <div className="pt-4 border-t border-current border-opacity-10">
            <p className="text-sm font-medium text-[#37322F]">
              ✓ {currentJob.clips.length} clip{currentJob.clips.length !== 1 ? "s" : ""} generated
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
