import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

function Dashboard() {
  const [activityData, setActivityData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("APPLE");
  const [combinedData, setCombinedData] = useState([]);

  const [realValuesData, setRealValuesData] = useState([]);

  useEffect(() => {
    const fetchRealValuesData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/real-values-history?company=${selectedCompany}`);
        setRealValuesData(res.data);
      } catch (error) {
        console.error("Failed to fetch real values history:", error);
      }
    };

    fetchRealValuesData();
  }, [selectedCompany]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/combined-chart-data?company=${selectedCompany}`
        );
        setCombinedData(res.data);
        setActivityData(res.data); // keep activityData updated too
      } catch (error) {
        console.error("Failed to fetch combined chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedCompany]);

  if (loading) {
    return <p className="text-white/60">Loading dashboard...</p>;
  }

  return (
          
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-right">
          <p className="font-medium text-white">{user?.name || "Guest"}</p>
          <p className="text-sm text-white/60">{user?.username}</p>
        </div>
      </header>

      <div className="mt-4 flex justify-center">
        <h3 className="text-lg font-semibold text-[#0ea5e9] mb-2">
              Account Balance : &nbsp;&nbsp;
        </h3>
        <p className="text-xl font-semibold text-white">
          ₹ {user.balance?.toLocaleString("en-IN") ?? "44545.00"} &nbsp; / &nbsp; 
          $ {user.balance?.toLocaleString("en-US") ?? "510.82"}
        </p>
      </div>

      {/* Status & Recent Activity */}
      <div className="flex justify-between items-start mb-6">
        {/* Status */}
        <div>
          <p className="text-white/60">Status</p>
          <h2 className="text-xl font-bold text-[#29c174]">Active</h2>
        </div>

        {/* Recent Activity Small */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-lg w-56">
          <h3 className="text-sm font-semibold mb-2 text-[#0ea5e9]">Recent Activity</h3>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start">
              <div className="bg-[#29c174]/10 p-1.5 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#29c174]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">Logged in</p>
                <p className="text-white/60">Just now</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Company Selector */}
      <div className="mb-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl flex flex-col justify-center items-center mx-auto w-full max-w-sm p-4">
        <label className="text-sm font-medium text-[#0ea5e9] mb-3 text-center">
          Select Company
        </label>
        <select
          className="w-full bg-transparent border border-white/20 rounded-md p-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option className="bg-slate-800 text-white" value="APPLE">APPLE</option>
          <option className="bg-slate-800 text-white" value="MICROSOFT">MICROSOFT</option>
          <option className="bg-slate-800 text-white" value="GOOGLE">GOOGLE</option>
          <option className="bg-slate-800 text-white" value="TESLA">TESLA</option>
          <option className="bg-slate-800 text-white" value="NVIDIA">NVIDIA</option>
        </select>
      </div>

      {/* Charts Row */}
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        
        {/* Predictions vs Actual Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6 w-full md:w-[48%]">
          <h3 className="text-xl font-semibold mb-4 text-[#0ea5e9]">
            {selectedCompany} – Predictions
          </h3>
          {combinedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={combinedData}>
                <XAxis dataKey="Date" tick={{ fill: '#93a3b8', fontSize: 12 }} stroke="#334155" />
                <YAxis tick={{ fill: '#93a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} stroke="#334155" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="Actual" stroke="#6366F1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Predicted" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center">
              <p className="text-white/60">Loading combined chart data...</p>
            </div>
          )}
        </div>

        {/* Actual Predictions Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6 w-full md:w-[48%] overflow-hidden">
          <h3 className="text-xl font-semibold mb-4 text-[#fbbf24]">
            {selectedCompany} – Actual Data
          </h3>
          {realValuesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={realValuesData}>
                <XAxis dataKey="Date" tick={{ fill: '#93a3b8', fontSize: 12 }} stroke="#334155" />
                <YAxis tick={{ fill: '#93a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} stroke="#334155" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="Close" stroke="#fbbf24" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center">
              <p className="text-white/60">Loading actual data...</p>
            </div>
          )}
        </div>
          <p className="mt-12 text-sm font-medium font-mono text-white">
          NOTE: THE PREDICTIONS FOR THE NEXT 30 DAYS ARE ONLY FORCASTED FOR THE ACTUAL WORKING DAYS.
          </p>

      </div>

      

    </div>
  );
}

export default Dashboard;
