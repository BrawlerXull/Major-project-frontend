"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import VideoUploadForm from "@/components/video-upload-form"
import JobStatusTracker from "@/components/job-status-tracker"
import ClipsDisplay from "@/components/clips-display"

export default function HighlightsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all jobs on mount
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:8000/api/v1/jobs?limit=20")
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
        // Auto-select first job if available
        if (data.length > 0 && !selectedJobId) {
          setSelectedJobId(data[0].job_id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobCreated = (jobId: string) => {
    setSelectedJobId(jobId)
    // Refresh jobs list
    setTimeout(fetchJobs, 500)
  }

  const selectedJob = jobs.find((job) => job.job_id === selectedJobId)

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3]">
      {/* Header */}
      <div className="border-b border-[rgba(55,50,47,0.12)] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-semibold text-[#37322F]">Viral Clips Generator</h1>
              <p className="text-[#605A57] mt-1">Transform your podcast videos into viral-worthy short clips</p>
            </div>
            <a href="/" className="text-[#37322F] hover:text-[#605A57] font-medium">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Form */}
          <div className="lg:col-span-1">
            <VideoUploadForm onJobCreated={handleJobCreated} />
          </div>

          {/* Right Column - Status and Clips */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job List */}
            <Card className="p-6 border border-[rgba(55,50,47,0.12)]">
              <h2 className="text-xl font-semibold text-[#37322F] mb-4">Recent Jobs</h2>
              {isLoading ? (
                <div className="text-center py-8 text-[#605A57]">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8 text-[#605A57]">No jobs yet. Upload a video to get started!</div>
              ) : (
                <div className="space-y-2">
                  {jobs.map((job) => (
                    <button
                      key={job.job_id}
                      onClick={() => setSelectedJobId(job.job_id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedJobId === job.job_id
                          ? "bg-[#37322F] text-white border-[#37322F]"
                          : "bg-white border-[rgba(55,50,47,0.12)] hover:border-[#37322F]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Job {job.job_id.slice(0, 8)}</p>
                          <p className={`text-sm ${selectedJobId === job.job_id ? "text-gray-300" : "text-[#605A57]"}`}>
                            {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : job.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : job.status === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Status Tracker */}
            {selectedJob && <JobStatusTracker job={selectedJob} />}

            {/* Clips Display */}
            {selectedJob?.clips && selectedJob.clips.length > 0 && (
              <ClipsDisplay clips={selectedJob.clips} jobId={selectedJob.job_id} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
