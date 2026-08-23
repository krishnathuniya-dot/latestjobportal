import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../css/Dash.css";

const data = [
  { name: 'Jan', jobs: 2 }, { name: 'Feb', jobs: 5 },
  { name: 'Mar', jobs: 3 }, { name: 'Apr', jobs: 9 },
  { name: 'May', jobs: 6 }, { name: 'Jun', jobs: 12 },
];

const Dash = () => {
  const stats = [
    { title: "Total Categories", count: "05", progress: 80, color: "#6366f1" },
    { title: "Total Employers", count: "03", progress: 60, color: "#3b82f6" },
    { title: "Total Candidates", count: "02", progress: 40, color: "#a855f7" },
    { title: "Total Jobs", count: "07", progress: 90, color: "#ec4899" },
  ];

  return (
    <div className="dashboard-wrapper">
      <header className="dash-header">
        <div>
          <h2>Analytics Dashboard</h2>
          <p>Overview of your job portal performance</p>
        </div>
        <div className="user-profile">Admin Portal</div>
      </header>

      <div className="stats-grid">
        {stats.map((item, i) => (
          <div key={i} className="glass-card">
            <div className="card-top">
              <span className="count-text">{item.count}</span>
            </div>
            <p className="card-title">{item.title}</p>
            <div className="progress-bg"><div className="progress-fill" style={{ width: `${item.progress}%`, backgroundColor: item.color }}></div></div>
          </div>
        ))}
      </div>

      <div className="main-content">
        <div className="chart-section">
          <h3>Growth Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs><linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
              <Tooltip />
              <Area type="monotone" dataKey="jobs" stroke="#6366f1" strokeWidth={3} fill="url(#colorJobs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="activity-section">
          <h3>Recent Activity</h3>
          <ul>
            <li><span>New Employer Registered</span> <b>2 mins ago</b></li>
            <li><span>Job Application Received</span> <b>1 hour ago</b></li>
            <li><span>Category Updated</span> <b>3 hours ago</b></li>
            <li><span>New Candidate Joined</span> <b>5 hours ago</b></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dash;