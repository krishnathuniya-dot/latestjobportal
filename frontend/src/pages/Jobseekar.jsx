
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  RefreshCw,
} from "lucide-react";
import "../css/jobseekerlist.css";
import { useNavigate } from "react-router-dom";

const API_URL = "https://latestjobportal.onrender.com";
const ITEMS_PER_PAGE = 5;

const Jobseeker = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const fetchJobseekers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/jobseekers`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Jobseekers load nahi ho paye.");
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.jobseekers)
        ? data.jobseekers
        : Array.isArray(data.users)
        ? data.users
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.data?.jobseekers)
        ? data.data.jobseekers
        : [];

      setJobseekers(list);
    } catch (err) {
      console.error("Jobseeker fetch error:", err);
      setError(err.message || "Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobseekers();
  }, []);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return jobseekers;

    return jobseekers.filter((item) =>
      [item.fullName, item.email, item.contactNumber].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [jobseekers, search]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const indexOfLastItem = safeCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentItems = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const getProfileImage = (item) => {
    const image = item.profilePic || item.profileImage;

    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${API_URL}/uploads/${String(image).replace(/^\/+/, "")}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="ff-loader">
        <RefreshCw size={20} className="ff-loading-icon" />
        <span>Fetching Jobseekers...</span>
      </div>
    );
  }

  return (
    <div className="ff-container">
      <div className="ff-card">
        {/* Header */}
        <div className="ff-header">
          <div className="ff-title-group">
            <div className="ff-icon-bg">
              <Users size={24} />
            </div>

            <div>
              <h2>Jobseeker Directory</h2>
              <p>Manage and view all registered jobseekers</p>
            </div>
          </div>

          <div className="ff-search-wrapper">
            <Search size={18} className="ff-search-icon" />

            <input
              type="text"
              placeholder="Search by name, email or contact..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            {search && (
              <button
                type="button"
                className="ff-clear-search"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Result summary */}
        <div className="ff-result-summary">
          Total Jobseekers: <strong>{filteredData.length}</strong>
        </div>

        {/* Error */}
        {error && (
          <div className="ff-error-message">
            <p>{error}</p>

            <button type="button" onClick={fetchJobseekers}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!error && (
          <div className="ff-table-container">
            <table className="ff-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Full Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => {
                    const profileImage = getProfileImage(item);

                    return (
                      <tr key={item._id || item.id || index}>
                        <td>
                          <div className="ff-avatar">
                            {profileImage ? (
                              <img
                                src={profileImage}
                                alt={item.fullName || "Jobseeker"}
                                className="ff-avatar-image"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <UserCircle size={32} />
                            )}
                          </div>
                        </td>

                        <td className="ff-name">
                          {item.fullName || "N/A"}
                        </td>

                        <td>
                          {item.contactNumber || (
                            <span className="ff-na">N/A</span>
                          )}
                        </td>

                        <td className="ff-email">
                          {item.email || "N/A"}
                        </td>

                        <td className="ff-date">
                          {formatDate(item.createdAt)}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="ff-view-btn"
                            title="View Full Details"
                            aria-label={`View ${item.fullName || "jobseeker"}`}
                            onClick={() =>
                              navigate(`/fulldetails/${item._id || item.id}`)
                            }
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="ff-no-data">
                      {search
                        ? "No jobseekers match your search."
                        : "No jobseekers registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!error && (
          <div className="ff-pagination">
            <span>
              Page {safeCurrentPage} of {totalPages || 1}
            </span>

            <div className="ff-pagination-btns">
              <button
                type="button"
                disabled={safeCurrentPage <= 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                disabled={
                  totalPages === 0 || safeCurrentPage >= totalPages
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobseeker;
