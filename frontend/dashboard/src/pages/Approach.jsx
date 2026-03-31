import { Database, Search, CheckCircle, BookOpen } from "lucide-react";

export default function Approach() {
  return (
    <div className="p-6 space-y-8 text-white bg-gradient-to-b from-[#020617] to-[#0f172a] min-h-screen">

      {/* HEADER */}
      <div>
        <p className="text-sm text-blue-400 uppercase tracking-wide">
          Data Visualization Project
        </p>
        <h1 className="text-4xl font-bold mt-2">Approach Analysis</h1>
      </div>

      {/* DATA APPROACH */}
      <div>
        <h2 className="text-3xl font-semibold mb-2">Data Approach</h2>
        <p className="text-gray-400 mb-6">
          Transparency in how we process, clean, and visualize the FEMA disaster declaration dataset.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl shadow-md">
            <Database className="mb-4 text-blue-400" />
            <h3 className="text-xl font-semibold mb-2">Data Sourcing</h3>
            <p className="text-gray-400">
              The primary data is sourced directly from the FEMA Open Data portal,
              covering all federal disaster declarations from 1953 to the present day.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl shadow-md">
            <Search className="mb-4 text-cyan-400" />
            <h3 className="text-xl font-semibold mb-2">Cleaning Process</h3>
            <p className="text-gray-400">
              We normalize incident types, handle missing geographic coordinates,
              and aggregate data by year and month to ensure consistent temporal analysis.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl shadow-md">
            <CheckCircle className="mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">Validation</h3>
            <p className="text-gray-400">
              Cross-referenced with historical climate records to ensure that major spikes
              in the data align with documented catastrophic events.
            </p>
          </div>

        </div>
      </div>

      {/* ANALYTICAL FRAMEWORK */}
      <div className="bg-[#020617] border border-gray-800 p-8 rounded-2xl shadow-md">

        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-blue-400" />
          <h2 className="text-2xl font-semibold">Analytical Framework</h2>
        </div>

        <div className="space-y-6">

          {/* STEP 1 */}
          <div className="flex gap-6">
            <span className="text-4xl text-gray-700 font-bold">01</span>
            <div>
              <h3 className="text-xl font-semibold">Temporal Aggregation</h3>
              <p className="text-gray-400">
                Data is grouped by declaration date. We use 5-year rolling averages to smooth
                out annual volatility and reveal long-term climate-driven trends.
              </p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="flex gap-6">
            <span className="text-4xl text-gray-700 font-bold">02</span>
            <div>
              <h3 className="text-xl font-semibold">Geographic Mapping</h3>
              <p className="text-gray-400">
                State-level data is normalized by population density to provide a more accurate
                representation of disaster impact per capita.
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="flex gap-6">
            <span className="text-4xl text-gray-700 font-bold">03</span>
            <div>
              <h3 className="text-xl font-semibold">Categorical Normalization</h3>
              <p className="text-gray-400">
                Over 40 legacy incident types have been mapped into 12 primary categories to
                maintain clarity while preserving the nuance of the original records.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 text-sm pt-4">
        VISUALIZING U.S. NATURAL DISASTER DECLARATIONS | PROJECT TEAM |
        INFOSYS SPRINGBOARD INTERNSHIP | 2026
      </div>

    </div>
  );
}