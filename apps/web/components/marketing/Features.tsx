import { Search, Users, FileCheck } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Multi-Engine Tracking",
    description:
      "Monitor your visibility across ChatGPT, Perplexity, and Google AI Overviews.",
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description:
      "See who outranks you, where you're missing, and track competitors.",
  },
  {
    icon: FileCheck,
    title: "Content Scoring",
    description:
      "Score any URL for AI-engine optimization. Get actionable recommendations.",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to own AI search.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools to understand and optimize your presence across
            all major AI search engines.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white hover:bg-blue-50/30"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex w-12 h-12 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
