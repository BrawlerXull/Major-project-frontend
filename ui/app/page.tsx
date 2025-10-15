"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveFeature((current) => (current + 1) % 2)
          }
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleFeatureClick = (index: number) => {
    if (!mountedRef.current) return
    setActiveFeature(index)
    setProgress(0)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MediaMind
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition">
              Features
            </a>
            <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition">
              Pricing
            </a>
            <a href="#docs" className="text-sm text-gray-300 hover:text-white transition">
              Docs
            </a>
          </div>
          <button className="text-sm text-gray-300 hover:text-white transition">Log in</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
            <span className="text-sm text-blue-300">AI-Powered Content Creation</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Transform Text into
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Viral Videos
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate stunning videos from text and extract viral-worthy highlights from long-form content. Powered by
            advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/highlights"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
            >
              Generate Highlights
            </Link>
            <Link
              href="/aivideo"
              className="px-8 py-4 border border-white/20 rounded-full font-semibold hover:bg-white/5 transition"
            >
              Generate AI Videos
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="relative h-96 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-blue-500/10 to-purple-500/10 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 animate-pulse"></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-300">Your AI-powered video creation studio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to create viral content</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Feature 1: Text to Video */}
            <div
              className={`p-8 rounded-2xl border transition-all cursor-pointer ${
                activeFeature === 0
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => handleFeatureClick(0)}
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3">Text to Video</h3>
              <p className="text-gray-300 mb-4">
                Convert your ideas into professional videos instantly. Just describe what you want and let AI do the
                magic.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Natural language processing</li>
                <li>✓ Multiple video styles</li>
                <li>✓ Custom branding options</li>
              </ul>
              {activeFeature === 0 && (
                <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <div
                    className="h-full bg-blue-400 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Feature 2: Highlights Extraction */}
            <div
              className={`p-8 rounded-2xl border transition-all cursor-pointer ${
                activeFeature === 1
                  ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => handleFeatureClick(1)}
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Highlights Extraction</h3>
              <p className="text-gray-300 mb-4">
                Upload long videos and automatically extract viral-worthy clips. Perfect for podcasts, streams, and
                more.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Automatic clip detection</li>
                <li>✓ Viral score ranking</li>
                <li>✓ One-click downloads</li>
              </ul>
              {activeFeature === 1 && (
                <div className="mt-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <div
                    className="h-full bg-purple-400 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Feature Details */}
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-white/10">
            {activeFeature === 0 ? (
              <div className="space-y-4">
                <h4 className="text-xl font-bold">How Text to Video Works</h4>
                <ol className="space-y-3 text-gray-300">
                  <li>
                    1. <span className="font-semibold">Write your script</span> - Describe your video idea in natural
                    language
                  </li>
                  <li>
                    2. <span className="font-semibold">Choose style</span> - Select from various video templates and
                    styles
                  </li>
                  <li>
                    3. <span className="font-semibold">Generate</span> - AI creates your video in seconds
                  </li>
                  <li>
                    4. <span className="font-semibold">Download</span> - Export in your preferred format
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xl font-bold">How Highlights Extraction Works</h4>
                <ol className="space-y-3 text-gray-300">
                  <li>
                    1. <span className="font-semibold">Upload video</span> - Drop your long-form content
                  </li>
                  <li>
                    2. <span className="font-semibold">AI analyzes</span> - Detects engaging moments and viral potential
                  </li>
                  <li>
                    3. <span className="font-semibold">Review clips</span> - See ranked highlights with viral scores
                  </li>
                  <li>
                    4. <span className="font-semibold">Download</span> - Get ready-to-share clips instantly
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <p className="text-gray-400">Videos Created</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                50M+
              </div>
              <p className="text-gray-400">Views Generated</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                99%
              </div>
              <p className="text-gray-400">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators using MediaMind to generate viral content
          </p>
          <Link
            href="/highlights"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
          >
            Start for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 MediaMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
