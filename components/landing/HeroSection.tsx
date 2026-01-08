import React from 'react'
import Link from "next/link";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <div>
      <section className="pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          <span className="block">SMARTER MONEY DECISIONS,</span>
          <span className="block tracking-tight bg-linear-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            POWERED BY AI
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Track expenses, analyse spending patterns, and grow your savings using
          intelligent insights.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
            Get Started
          </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
            View Demo
          </Button>
          </Link>

          
        </div>
      </div>
    </section>
    </div>
  )
}

export default HeroSection
