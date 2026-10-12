
import React, { useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiTrash2,
  FiX,
  FiCopy,
  FiDownload,
  FiAlertCircle,
  FiCheckCircle,
  FiUsers,
  FiMail,
 
  FiUser,
  FiCalendar,
} from "react-icons/fi";

import "../css/employerlist.css";

const API_URL = "https://latestjobportal.onrender.com";
const ITEMS_PER_PAGE = 8;

const EmployerList = () => {
  const [employers, setEmployers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState("");
  const [notice, setNotice] = useState({
    type: "",
    text: "",
  });

  // =========================================
  // FETCH EMPLOYERS
  // =========================================
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/employer`);

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to fetch employers."
        );
      }

      // Support different API response formats
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.employers)
        ? result.employers
        : Array.isArray(result?.users)
        ? result.users
        : [];

      setEmployers(list);
    } catch (err) {
      console.error("Fetch employers error:", err);
      setError(err.message || "Something went wrong.");
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  // =========================================
  // FILTER EMPLOYERS
  // =========================================
  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return employers;
    }

    return employers.filter((item) => {
      const companyName = String(item?.companyName || "").toLowerCase();
      const personName = String(item?.personName || "").toLowerCase();
      const email = String(item?.email || "").toLowerCase();
      const status = String(item?.status || "Active").toLowerCase();

      return (
        companyName.includes(query) ||
        personName.includes(query) ||
        email.includes(query) ||
        status.includes(query)
      );
    });
  }, [employers, search]);

  // =========================================
  // PAGINATION
  // =========================================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const indexOfLastItem = safeCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentEmployers = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // =========================================
  // COMPANY LOGO
  // =========================================
  const getLogoUrl = (logo) => {
    if (!logo || typeof logo !== "string") {
      return "";
    }

    const cleanLogo = logo.trim();

    // Cloudinary URL or another complete image URL
    if (/^https?:\/\//i.test(cleanLogo)) {
      return cleanLogo;
    }

    // Support old local-upload records
    return `${API_URL}/uploads/${cleanLogo.replace(/^\/+/, "")}`;
  };

  // =========================================
  // COPY EMAIL
  // =========================================
  const copyToClipboard = async (email) => {
    if (!email) {
      setNotice({
        type: "error",
        text: "Email address is not available.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(email);

      setNotice({
        type: "success",
        text: "Email copied successfully.",
      });
    } catch (err) {
      console.error("Copy email error:", err);

      setNotice({
        type: "error",
        text: "Unable to copy email. Please copy it manually.",
      });
    }

    setTimeout(() => {
      setNotice({ type: "", text: "" });
    }, 3000);
  };

  // =========================================
  // VIEW EMPLOYER
  // =========================================
  const openEmployerModal = (employer) => {
    setSelectedEmployer(employer);
    setShowModal(true);
  };

  const closeEmployerModal = () => {
    setShowModal(false);
    setSelectedEmployer(null);
  };

  // =========================================
  // DELETE EMPLOYER
  // =========================================
  // This action requires a matching backend DELETE route.
  const deleteEmployer = async (employer) => {
    if (!employer?._id || deletingId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        employer.companyName || "this employer"
      }? This action may not be reversible.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(employer._id);
      setNotice({ type: "", text: "" });

      const response = await fetch(
        `${API_URL}/api/employer/${employer._id}`,
        {
          method: "DELETE",
        }
      );

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Employer could not be deleted. Check the backend DELETE route."
        );
      }

      setEmployers((previous) =>
        previous.filter((item) => item._id !== employer._id)
      );

      if (selectedEmployer?._id === employer._id) {
        closeEmployerModal();
      }

      setNotice({
        type: "success",
        text: result?.message || "Employer deleted successfully.",
      });
    } catch (err) {
      console.error("Delete employer error:", err);

      setNotice({
        type: "error",
        text: err.message || "Unable to delete employer.",
      });
    } finally {
      setDeletingId("");
      setTimeout(() => {
        setNotice({ type: "", text: "" });
      }, 4000);
    }
  };

  // =========================================
  // CSV DATA
  // =========================================
  const csvHeaders = [
    { label: "Company Name", key: "companyName" },
    { label: "Contact Person", key: "personName" },
    { label: "Email", key: "email" },
    { label: "Status", key: "status" },
    { label: "Tagline", key: "tagline" },
    { label: "Website", key: "website" },
    { label: "Created Date", key: "createdAt" },
  ];

  const csvData = filteredData.map((item) => ({
    companyName: item?.companyName || "",
    personName: item?.personName || "",
    email: item?.email || "",
    status: item?.status || "Active",
    tagline: item?.tagline || "",
    website: item?.website || "",
    createdAt: item?.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN")
      : "",
  }));

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="uk-employer-container">
        <div className="uk-table-wrapper">
          <div className="uk-card-header">
            Employer Lists
          </div>

          <div className="employer-loading">
            <FiRefreshCw className="applications-spin" />
            <p>Loading employer details...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================
  return (
    <div className="uk-employer-container">
      <div className="uk-table-wrapper">
        {/* HEADER */}
        <div className="uk-card-header">
          <div className="employer-heading">
            <span className="employer-heading-icon">
              <FiUsers />
            </span>

            <div>
              <h2>Employer Lists</h2>
              <p>
                Manage and review registered employers.
              </p>
            </div>
          </div>

          <div className="employer-toolbar">
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="employers_list.csv"
              className="btn-action export"
            >
              <FiDownload />
              Export CSV
            </CSVLink>

            <label className="employer-search-box">
              <FiSearch />

              <input
                type="text"
                className="uk-search-input"
                placeholder="Search employers..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />

              {search && (
                <button
                  type="button"
                  className="employer-clear-search"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                >
                  <FiX />
                </button>
              )}
            </label>

            <button
              type="button"
              className="employer-refresh-btn"
              onClick={fetchEmployers}
              disabled={loading}
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>

        {/* NOTICE */}
        {notice.text && (
          <div
            className={`employer-notice ${
              notice.type === "success"
                ? "employer-notice-success"
                : "employer-notice-error"
            }`}
            role="status"
            aria-live="polite"
          >
            {notice.type === "success" ? (
              <FiCheckCircle />
            ) : (
              <FiAlertCircle />
            )}

            {notice.text}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="employer-error">
            <FiAlertCircle />
            <span>{error}</span>

            <button type="button" onClick={fetchEmployers}>
              Try Again
            </button>
          </div>
        )}

        {/* TABLE */}
        {!error && (
          <>
            <div className="employer-table-summary">
              <span>
                Total Employers: <strong>{employers.length}</strong>
              </span>

              <span>
                Showing: <strong>{filteredData.length}</strong>
              </span>
            </div>

            <div className="employer-table-scroll">
              <table className="uk-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>COMPANY</th>
                    <th>PERSON</th>
                    <th>EMAIL</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployers.length > 0 ? (
                    currentEmployers.map((item, index) => (
                      <tr key={item._id || `${item.email}-${index}`}>
                        <td>
                          {indexOfFirstItem + index + 1}
                        </td>

                        <td className="font-bold">
                          <div className="employer-company-cell">
                            <div className="employer-table-logo">
                              {getLogoUrl(item?.logo) ? (
                                <img
                                  src={getLogoUrl(item.logo)}
                                  alt=""
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.style.display = "none";

                                    const fallback =
                                      e.currentTarget.parentElement?.querySelector(
                                        ".employer-table-logo-fallback"
                                      );

                                    if (fallback) {
                                      fallback.style.display = "flex";
                                    }
                                  }}
                                />
                              ) : null}

                              <span
                                className="employer-table-logo-fallback"
                                style={{
                                  display: getLogoUrl(item?.logo)
                                    ? "none"
                                    : "flex",
                                }}
                              >
                                {String(
                                  item?.companyName || "C"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>

                            <span>
                              {item?.companyName || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td>{item?.personName || "N/A"}</td>

                        <td>{item?.email || "N/A"}</td>

                        <td>
                          <span className="badge-status">
                            {item?.status || "Active"}
                          </span>
                        </td>

                        <td>
                          {item?.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleDateString("en-IN")
                            : "N/A"}
                        </td>

                        <td>
                          <div className="employer-actions">
                            <button
                              type="button"
                              className="btn-action view"
                              onClick={() =>
                                openEmployerModal(item)
                              }
                            >
                              <FiEye />
                              View
                            </button>

                            <button
                              type="button"
                              className="btn-action delete"
                              disabled={deletingId === item._id}
                              onClick={() => deleteEmployer(item)}
                            >
                              <FiTrash2 />

                              {deletingId === item._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >
                        {search
                          ? "No employers match your search."
                          : "No employers found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="uk-pagination">
              <button
                type="button"
                disabled={safeCurrentPage <= 1}
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.max(1, previous - 1)
                  )
                }
              >
                Prev
              </button>

              <span>
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={safeCurrentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.min(totalPages, previous + 1)
                  )
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* =========================================
          EMPLOYER DETAILS MODAL
      ========================================= */}
      {showModal && selectedEmployer && (
        <div
          className="employer-modal-overlay"
          onClick={closeEmployerModal}
        >
          <div
            className="employer-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Employer details"
          >
            <div className="view-header">
              <span>View Employer Details</span>

              <button
                type="button"
                className="close-btn"
                onClick={closeEmployerModal}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>

            {/* MODAL COMPANY HEADER */}
            <div className="employer-modal-company">
              <div className="employer-modal-logo">
                {getLogoUrl(selectedEmployer.logo) ? (
                  <img
                    src={getLogoUrl(selectedEmployer.logo)}
                    alt={`${selectedEmployer.companyName || "Company"} logo`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";

                      const fallback =
                        e.currentTarget.parentElement?.querySelector(
                          ".employer-modal-logo-fallback"
                        );

                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                ) : null}

                <span
                  className="employer-modal-logo-fallback"
                  style={{
                    display: getLogoUrl(selectedEmployer.logo)
                      ? "none"
                      : "flex",
                  }}
                >
                  {String(
                    selectedEmployer.companyName || "C"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>

              <div>
                <h3>
                  {selectedEmployer.companyName || "N/A"}
                </h3>

                <p>
                  {selectedEmployer.tagline || "Company profile"}
                </p>
              </div>
            </div>

            {/* DETAILS TABLE */}
            <div className="employer-details-scroll">
              <table className="details-table">
                <tbody>
                  <tr>
                    <th>
                      <FiBuilding />
                      Name of Company
                    </th>

                    <td>
                      {selectedEmployer.companyName || "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <th>
                      <FiUser />
                      Concern Person
                    </th>

                    <td>
                      {selectedEmployer.personName || "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <th>
                      <FiMail />
                      Email
                    </th>

                    <td>
                      <div className="employer-email-value">
                        <span>
                          {selectedEmployer.email || "N/A"}
                        </span>

                        {selectedEmployer.email && (
                          <button
                            type="button"
                            className="employer-copy-btn"
                            onClick={() =>
                              copyToClipboard(
                                selectedEmployer.email
                              )
                            }
                            aria-label="Copy email"
                            title="Copy email"
                          >
                            <FiCopy />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th>Tag Line</th>
                    <td>
                      {selectedEmployer.tagline || "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <th>Status</th>
                    <td>
                      <span className="badge-status">
                        {selectedEmployer.status || "Active"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th>Website</th>
                    <td>
                      {selectedEmployer.website ? (
                        <a
                          href={selectedEmployer.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {selectedEmployer.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th>
                      <FiCalendar />
                      Registration Date
                    </th>

                    <td>
                      {selectedEmployer.createdAt
                        ? new Date(
                            selectedEmployer.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <th>Company Description</th>
                    <td>
                      {selectedEmployer.description || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="employer-modal-footer">
              <button
                type="button"
                className="btn-action view"
                onClick={closeEmployerModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerList;
