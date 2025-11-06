import React from "react";

export default function AnalyticsCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow-md ${color} text-center`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
