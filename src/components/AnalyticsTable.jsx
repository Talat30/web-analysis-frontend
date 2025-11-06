import React from "react";

export default function AnalyticsTable({ pageVisits }) {
  const entries = Object.entries(pageVisits);

  // Function to format seconds into hr:min:sec
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (entries.length === 0)
    return <p className="text-gray-400 text-center mt-10">No page data yet</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Page Breakdown</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-2 px-4">Page</th>
            <th className="py-2 px-4">Visits</th>
            <th className="py-2 px-4">Total Time</th>
            <th className="py-2 px-4">Avg Time</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([page, stats]) => (
            <tr key={page} className="border-b border-gray-700 hover:bg-gray-700">
              <td className="py-2 px-4">{page}</td>
              <td className="py-2 px-4">{stats.count}</td>
              <td className="py-2 px-4">{formatTime(stats.totalTime)}</td>
              <td className="py-2 px-4">
                {stats.count > 0 ? formatTime(stats.totalTime / stats.count) : "00:00:00"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
