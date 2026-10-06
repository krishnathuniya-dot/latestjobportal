import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FiBriefcase,
  FiUsers,
  FiGrid,
  FiUserCheck,
  FiTrendingUp,
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiActivity,
  FiPlus,
  FiSettings,
} from "react-icons/fi";

import "../css/dash.css";

const data = [
  { name: "Jan", jobs: 2 },
  { name: "Feb", jobs: 5 },
  { name: "Mar", jobs: 3 },
  { name: "Apr", jobs: 9 },
  { name: "May", jobs: 6 },
  { name: "Jun", jobs: 12 },
];

const Dash = () => {
  const stats = [
    {
      title: "Total Categories",
      count: "05",
      progress: 80,
      icon: <FiGrid />,
      color: "#6366f1",
      change: "+12%",
    },
    {
      title: "Total Employers",
      count: "03",
      progress: 60,
      icon: <FiBriefcase />,
      color: "#0b72e7",
      change: "+8%",
    },
    {
      title: "Total Candidates",
      count: "02",
      progress: 40,
      icon: <FiUsers />,
      color: "#8b5cf6",
      change: "+15%",
    },
    {
      title: "Total Jobs",
      count: "07",
      progress: 90,
      icon: <FiUserCheck />,
      color: "#ec4899",
      change: "+20%",
    },
  ];

  const activities = [
    {
      title: "New Employer Registered",
      time: "2 mins ago",
      icon: <FiBriefcase />,
      type: "blue",
    },
    {
      title: "Job Application Received",
      time: "1 hour ago",
      icon: <FiUserCheck />,
      type: "green",
    },
    {
      title: "Category Updated",
      time: "3 hours ago",
      icon: <FiGrid />,
      type: "purple",
    },
    {
      title: "New Candidate Joined",
      time: "5 hours ago",
      icon: <FiUsers />,
      type: "pink",
    },
  ];

  return (
    <div className="dashboard-wrapper">

      {/* ================= HEADER ================= */}
      <header className="dash-header">
        <div className="dash-header-content">
          <span className="dash-small-title">
            ADMIN PANEL
          </span>

          <h2>Analytics Dashboard</h2>

          <p>
            Monitor your job portal performance and activities
            from one place.
          </p>
        </div>

        <div className="user-profile">
          <div className="admin-avatar">
            <FiActivity />
          </div>

          <div className="admin-info">
            <strong>Admin Portal</strong>
            <span>Administrator</span>
          </div>
        </div>
      </header>

      {/* ================= STATS ================= */}
      <section className="stats-grid">
        {stats.map((item, i) => (
          <div
            key={i}
            className="glass-card"
          >
            <div className="card-top">

              <div
                className="stat-icon"
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}15`,
                }}
              >
                {item.icon}
              </div>

              <div className="stat-change">
                <FiArrowUpRight />
                {item.change}
              </div>
            </div>

            <div className="count-text">
              {item.count}
            </div>

            <p className="card-title">
              {item.title}
            </p>

            <div className="progress-wrapper">
              <div className="progress-label">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>

              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${item.progress}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">

        {/* ================= CHART ================= */}
        <section className="chart-section">

          <div className="section-header">
            <div>
              <span className="section-label">
                PERFORMANCE
              </span>

              <h3>
                Jobs Growth Analytics
              </h3>

              <p>
                Monthly job posting overview
              </p>
            </div>

            <div className="chart-icon">
              <FiTrendingUp />
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <AreaChart
                data={data}
                margin={{
                  top: 15,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorJobs"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#0756b8"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="95%"
                      stopColor="#0756b8"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e8eef5"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#718096",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#718096",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    border: "none",
                    borderRadius: "10px",
                    boxShadow:
                      "0 8px 25px rgba(0, 0, 0, 0.12)",
                  }}
                  cursor={{
                    stroke: "#0756b8",
                    strokeDasharray: "4 4",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="jobs"
                  stroke="#0756b8"
                  strokeWidth={3}
                  fill="url(#colorJobs)"
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ================= ACTIVITY ================= */}
        <section className="activity-section">

          <div className="section-header">
            <div>
              <span className="section-label">
                ACTIVITY
              </span>

              <h3>
                Recent Activity
              </h3>

              <p>
                Latest portal updates
              </p>
            </div>

            <div className="activity-header-icon">
              <FiClock />
            </div>
          </div>

          <div className="activity-list">

            {activities.map((activity, index) => (
              <div
                className="activity-item"
                key={index}
              >
                <div
                  className={`activity-icon ${activity.type}`}
                >
                  {activity.icon}
                </div>

                <div className="activity-info">
                  <strong>
                    {activity.title}
                  </strong>

                  <span>
                    <FiClock />
                    {activity.time}
                  </span>
                </div>

                <FiCheckCircle className="activity-check" />
              </div>
            ))}

          </div>

          <button className="view-activity-btn">
            View All Activity
            <FiArrowUpRight />
          </button>

        </section>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="quick-section">

        <div className="quick-header">
          <div>
            <span className="section-label">
              QUICK ACTIONS
            </span>

            <h3>
              Manage Your Portal
            </h3>
          </div>
        </div>

        <div className="quick-grid">

          <div className="quick-card">
            <div className="quick-card-icon">
              <FiPlus />
            </div>

            <div>
              <h4>Add New Job</h4>
              <p>
                Create and publish a new job
              </p>
            </div>

            <FiArrowUpRight className="quick-arrow" />
          </div>

          <div className="quick-card">
            <div className="quick-card-icon purple">
              <FiUsers />
            </div>

            <div>
              <h4>Manage Candidates</h4>
              <p>
                View registered candidates
              </p>
            </div>

            <FiArrowUpRight className="quick-arrow" />
          </div>

          <div className="quick-card">
            <div className="quick-card-icon green">
              <FiBriefcase />
            </div>

            <div>
              <h4>Manage Employers</h4>
              <p>
                Review employer accounts
              </p>
            </div>

            <FiArrowUpRight className="quick-arrow" />
          </div>

          <div className="quick-card">
            <div className="quick-card-icon orange">
              <FiSettings />
            </div>

            <div>
              <h4>Portal Settings</h4>
              <p>
                Update portal configuration
              </p>
            </div>

            <FiArrowUpRight className="quick-arrow" />
          </div>

        </div>
      </section>

    </div>
  );
};

export default Dash;