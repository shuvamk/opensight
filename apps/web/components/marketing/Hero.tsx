import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50 -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Main content */}
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
            <span className="text-sm font-medium text-blue-900">
              Open-source AI visibility platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900">
            See how AI search engines talk about your brand.
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
            Open-source AI visibility analytics. Track your brand across ChatGPT,
            Perplexity, and Google AI Overviews.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Start Free — No Credit Card
              </Button>
            </Link>
            <a
              href="https://github.com/yourusername/opensight"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors font-medium"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Dashboard screenshot placeholder */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="relative">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-2xl opacity-0 blur group-hover:opacity-100 transition duration-300" />

            {/* Screenshot placeholder */}
            <div className="relative bg-gray-100 rounded-2xl border border-gray-200 aspect-video flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
              <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded opacity-50" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-gray-600 font-medium">Dashboard Preview</p>
                  <p className="text-gray-500 text-sm">
                    Track your AI visibility in real-time
                  </p>
                </div>
              </div>

              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05) 76%, transparent 77%, transparent)`,
                  backgroundSize: "50px 50px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
