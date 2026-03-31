export default function Overview() {
  return (
    <div className="p-6 space-y-10 text-white bg-gradient-to-b from-[#020617] to-[#0f172a] min-h-screen">

      {/* HERO SECTION */}
      <div className="space-y-4">
        <p className="text-blue-400 text-sm">
          National Disaster Database • 1953 – 2024
        </p>

        <h1 className="text-5xl font-bold leading-tight">
          Visualizing U.S. <span className="text-blue-400">Natural Disaster</span> Declarations
        </h1>

        <p className="text-gray-400 max-w-3xl">
          This dashboard presents a comprehensive analysis of U.S. natural disaster declarations
          over seven decades. It explores how disaster patterns have evolved over time,
          how they vary across different regions, and which types of disasters occur most frequently.
          The goal is to uncover meaningful insights that can support better understanding,
          preparedness, and decision-making.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">TOTAL DECLARATIONS</p>
          <h2 className="text-3xl font-bold mt-2">64,218</h2>
        </div>

        <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">ACTIVE STATES</p>
          <h2 className="text-3xl font-bold mt-2">50</h2>
        </div>

        <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">MAJOR EVENTS</p>
          <h2 className="text-3xl font-bold mt-2">2,410</h2>
        </div>

        <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">AVG. PER YEAR</p>
          <h2 className="text-3xl font-bold mt-2">904</h2>
        </div>

      </div>

      {/* INCIDENT TYPES */}
      <div>
        <h2 className="text-3xl font-semibold mb-2">Primary Incident Categories</h2>
        <p className="text-gray-400 mb-6">
          The most frequent drivers of federal emergency declarations across the nation.
        </p>

        <div className="grid md:grid-cols-5 gap-6">

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl text-center">
            <h3 className="text-lg font-semibold">Severe Storm</h3>
            <p className="text-gray-400">28.4k Declarations</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl text-center">
            <h3 className="text-lg font-semibold">Flood</h3>
            <p className="text-gray-400">12.1k Declarations</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl text-center">
            <h3 className="text-lg font-semibold">Fire</h3>
            <p className="text-gray-400">8.4k Declarations</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl text-center">
            <h3 className="text-lg font-semibold">Hurricane</h3>
            <p className="text-gray-400">5.2k Declarations</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl text-center">
            <h3 className="text-lg font-semibold">Biological</h3>
            <p className="text-gray-400">3.1k Declarations</p>
          </div>

        </div>
      </div>

      {/* KEY INSIGHTS */}
      <div>
        <h2 className="text-3xl font-semibold mb-6">Key Insights</h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
            <p>Federal disaster declarations have increased by over 300% since the 1960s.</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
            <p>Texas and California consistently lead the nation in total disaster counts.</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
            <p>Severe storms are the most frequent driver of emergency aid across all regions.</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
            <p>The year 2020 saw a record-breaking spike in biological emergency declarations.</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
            <p>Spring months (April–June) represent the most volatile period for weather events.</p>
          </div>

          <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
            <p>Public assistance for infrastructure repair remains the largest federal expenditure.</p>
          </div>

        </div>
      </div>

      {/* HUMAN IMPACT */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">The Human Element</h2>
        <p>
          Beyond the numbers, each declaration represents a community in need. This data helps
          policymakers allocate resources where they are needed most, ensuring that no community
          is left behind after a disaster.
        </p>
      </div>

    </div>
  );
}