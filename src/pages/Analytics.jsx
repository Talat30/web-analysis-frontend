import React, { useEffect, useState } from "react";
import AnalyticsCard from "../components/AnalyticsCard";
import AnalyticsTable from "../components/AnalyticsTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("avg"); // 'avg' or 'total'
  const [lineChartTypes, setLineChartTypes] = useState({}); // per page: 'visits' or 'time'

  // Function to get display name for pages
  const getDisplayName = (page) => {
    const mapping = {
      "/": "Home",
      "/products": "Products",
      "/about": "About",
    };
    return mapping[page] || page;
  };

  // Function to format seconds into hr:min:sec
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Server returned an error");
        const json = await res.json();
        console.log("✅ Analytics data:", json);
        setData(json);
      } catch (err) {
        console.error("❌ Error fetching analytics:", err);
        setError("⚠️ Failed to load analytics. Check backend connection.");
      }
    };

    const fetchTimeSeries = async () => {
      try {
        const res = await fetch("/api/time-series");
        if (!res.ok) throw new Error("Server returned an error");
        const json = await res.json();
        console.log("✅ Time-series data:", json);
        setTimeSeries(json);
        // Initialize line chart types to 'visits' for each page
        const initialTypes = {};
        Object.keys(json).forEach(page => {
          initialTypes[page] = 'visits';
        });
        setLineChartTypes(initialTypes);
      } catch (err) {
        console.error("❌ Error fetching time-series:", err);
      }
    };

    fetchAnalytics();
    fetchTimeSeries();
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchTimeSeries();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error)
    return (
      <p className="p-4 text-red-500 font-semibold text-center">{error}</p>
    );
  if (!data)
    return (
      <p className="p-4 text-gray-500 text-center">Loading analytics...</p>
    );

  // The backend returns { totalPages, mostVisited, topPages }
  const topPages = data?.topPages || [];
  const totalVisits = topPages.reduce((sum, p) => sum + (p.views || 0), 0);
  const mostVisited =
    data?.mostVisited || { page: "N/A", views: 0, avgTime: "0" };
  const mostVisitedPage = getDisplayName(mostVisited.page);
  const avgTimeOnMostVisited = mostVisited.avgTime;

  const pageVisits = Object.fromEntries(
    topPages.map((p) => [
      getDisplayName(p.page),
      { count: p.views, totalTime: parseFloat(p.avgTime) * p.views },
    ])
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg space-y-8">
        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          📈 Website Analytics Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AnalyticsCard
            title="Total Visits"
            value={totalVisits}
            color="bg-blue-600/30 border border-blue-400"
          />
          <AnalyticsCard
            title="Most Visited Page"
            value={mostVisitedPage || "N/A"}
            color="bg-green-600/30 border border-green-400"
          />
          <AnalyticsCard
            title="Avg Time on Most Visited"
            value={formatTime(parseFloat(avgTimeOnMostVisited))}
            color="bg-purple-600/30 border border-purple-400"
          />
        </div>

        {/* Detailed Table */}
        <AnalyticsTable pageVisits={pageVisits || {}} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bar Chart for Page Visits */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Page Visits
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topPages.map((p) => ({
                  name: getDisplayName(p.page),
                  visits: p.views,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Bar dataKey="visits" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart for Time Distribution */}
          <div className="bg-gray-700 rounded-lg p-6 relative">
            {/* Button aligned top-left */}
            <button
              onClick={() =>
                setChartType(chartType === "avg" ? "total" : "avg")
              }
              className="absolute top-0 right-0 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition z-10 shadow-md"
            >
              {chartType === "avg" ? "Average Time" : "Total Time"}
            </button>

            <h2 className="text-xl font-semibold text-white text-center mt-6 mb-4">
              {chartType === "avg"
                ? "Avg Time Distribution"
                : "Total Time Distribution"}
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topPages.map((p) => ({
                    name: getDisplayName(p.page),
                    value:
                      chartType === "avg"
                        ? parseFloat(p.avgTime)
                        : parseFloat(p.avgTime) * p.views,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topPages.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3B82F6", "#10B981", "#F59E0B"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#a0bee2ff",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                  formatter={(value) => [formatTime(value), "Time Spent"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Charts for Time-Series Activity */}
        {timeSeries && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-white">
              Activity Over Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(timeSeries).map(([page, data]) => {
                const currentType = lineChartTypes[page] || 'visits';
                return (
                  <div key={page} className="bg-gray-700 rounded-lg p-6 relative">
                    <button
                      onClick={() => setLineChartTypes(prev => ({...prev, [page]: prev[page] === 'visits' ? 'time' : 'visits'}))}
                      className="absolute top-0 right-0 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition z-10 shadow-md"
                    >
                      {currentType === 'visits' ? 'Time Spent' : 'Visits'}
                    </button>
                    <h3 className="text-lg font-semibold text-white text-center mt-6 mb-4">
                      {getDisplayName(page)} - {currentType === 'visits' ? 'Visits' : 'Time Spent'} Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="time"
                          stroke="#9CA3AF"
                          tickFormatter={(value) => value.split('-')[1]} // Show hour
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "none",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#F3F4F6" }}
                          labelFormatter={(value) => `Hour: ${value.split('-')[1]}`}
                          formatter={currentType === 'time' ? (value) => [formatTime(value), "Time Spent"] : undefined}
                        />
                        <Line
                          type="monotone"
                          dataKey={currentType === 'visits' ? 'visits' : 'totalTime'}
                          stroke={currentType === 'visits' ? '#3B82F6' : '#10B981'}
                          strokeWidth={2}
                          dot={{ fill: currentType === 'visits' ? '#3B82F6' : '#10B981' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
