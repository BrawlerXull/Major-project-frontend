"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            MindShorts
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Highlights Generator</span>
            <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Extract Viral
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Highlights
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload your long-form videos and let AI automatically extract the most viral-worthy clips
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload Form */}
            <div className="lg:col-span-1">
              <VideoUploadForm onJobCreated={handleJobCreated} />
            </div>

            {/* Right Column - Status and Clips */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job List */}
              <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Jobs</h2>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No jobs yet. Upload a video to get started!</div>
                ) : (
                  <div className="space-y-2">
                    {jobs.map((job) => (
                      <button
                        key={job.job_id}
                        onClick={() => setSelectedJobId(job.job_id)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          selectedJobId === job.job_id
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50"
                            : "bg-white/5 border-white/10 hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">Job {job.job_id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-400">{new Date(job.created_at).toLocaleDateString()}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.status === "completed"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : job.status === "processing"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : job.status === "failed"
                                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                    : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
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
    </div>
  )
}
