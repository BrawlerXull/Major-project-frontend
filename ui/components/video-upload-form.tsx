"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface VideoUploadFormProps {
  onJobCreated: (jobId: string) => void
}

export default function VideoUploadForm({ onJobCreated }: VideoUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const droppedFile = files[0]
      if (isValidVideoFile(droppedFile)) {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Please upload a valid video file (MP4, MOV, AVI, MKV, WEBM)")
      }
    }
  }

  const isValidVideoFile = (file: File): boolean => {
    const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"]
    const validExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"]
    const hasValidType = validTypes.includes(file.type)
    const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    return hasValidType || hasValidExtension
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const selectedFile = files[0]
      if (isValidVideoFile(selectedFile)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a valid video file (MP4, MOV, AVI, MKV, WEBM)")
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://localhost:8000/api/v1/jobs", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Upload failed")
      }

      const data = await response.json()
      setFile(null)
      onJobCreated(data.job_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm sticky top-24">
      <h2 className="text-xl font-semibold text-white mb-4">Upload Video</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-500/10"
              : "border-white/20 hover:border-blue-400/50 hover:bg-blue-500/5"
          }`}
        >
          <input
            type="file"
            id="video-input"
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
            disabled={isUploading}
          />
          <label htmlFor="video-input" className="cursor-pointer block">
            <div className="text-4xl mb-2">🎬</div>
            <p className="text-white font-medium">Drag and drop your video here</p>
            <p className="text-gray-400 text-sm mt-1">or click to browse</p>
            <p className="text-gray-500 text-xs mt-2">Max 500MB • MP4, MOV, AVI, MKV, WEBM</p>
          </label>
        </div>

        {file && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-300 font-medium text-sm">✓ {file.name}</p>
            <p className="text-green-400/70 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={!file || isUploading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Generate Clips"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-gray-300 text-sm">
          <strong>How it works:</strong>
        </p>
        <ul className="text-gray-400 text-sm mt-2 space-y-1">
          <li>1. Upload your podcast video</li>
          <li>2. AI transcribes and analyzes content</li>
          <li>3. Generates viral-worthy clips</li>
          <li>4. Download and share!</li>
        </ul>
      </div>
    </Card>
  )
}
