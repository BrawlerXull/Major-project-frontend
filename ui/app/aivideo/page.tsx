"use client";

import { Card, CardBody } from "@nextui-org/card";
import AIGen from "@/components/ai";

export default function AIVideoGen() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MediaMind
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">AI Video Generator</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-center mb-6">
          Generate AI
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Videos Instantly
          </span>
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Transform your ideas into stunning AI-generated videos with just a few clicks. Fast, easy, and powered by advanced AI.
        </p>

        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg">
          <CardBody>
            <section className="flex flex-col justify-center gap-4 p-4 md:p-6">
              <AIGen />
            </section>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
