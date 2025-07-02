import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useRefresh } from "../context/RefreshContext";

const WeeklyChart = ({
  data,
  isDarkMode = false,
  type = "line",
  range = "week",
  onRangeChange,
}) => {
  const { refreshKey } = useRefresh();

  useEffect(() => {
    // Trigger a data refresh when refreshKey changes
    if (onRangeChange) {
      onRangeChange(range);
    }
    // If you fetch data inside this component, call your fetch function here instead
    // eslint-disable-next-line
  }, [refreshKey]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 border rounded-lg shadow-lg transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 shadow-gray-900/50"
              : "bg-white border-gray-200 shadow-gray-200/50"
          }`}
        >
          <p
            className={`font-medium transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {label}
          </p>
          <p className="text-success-600">
            Revenue:{" "}
            <span className="font-semibold">
              ₹{payload[0]?.value?.toLocaleString?.() ?? ""}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-gray-900/50"
          : "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 shadow-gray-200/50"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold transition-colors duration-300 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <select
            value={range}
            onChange={(e) => onRangeChange && onRangeChange(e.target.value)}
            className={`font-semibold outline-none rounded px-2 py-1 transition-colors duration-200
              ${
                isDarkMode
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-white text-gray-900 border border-gray-300"
              }
            `}
            style={isDarkMode ? { colorScheme: "dark" } : {}}
          >
            <option value="week">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
            <span
              className={`transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Revenue
            </span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#f1f5f9"}
              />
              <XAxis
                dataKey="day"
                stroke={isDarkMode ? "#9CA3AF" : "#64748b"}
                fontSize={12}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={isDarkMode ? "#9CA3AF" : "#64748b"}
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#22c55e"
                barSize={40}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#f1f5f9"}
              />
              <XAxis
                dataKey="day"
                stroke={isDarkMode ? "#9CA3AF" : "#64748b"}
                fontSize={12}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={isDarkMode ? "#9CA3AF" : "#64748b"}
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="right"
                type="linear"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={5}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyChart;
