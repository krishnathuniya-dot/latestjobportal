
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/applicationdetail.css";

export default function Applicationpage() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Short Listed");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(
        `https://latestjobportal.onrender.com/api/application-details/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setApplication(data.data);

        // Existing message/status ko modal mein bhi show karo
        setMessage(data.data?.message || "");
        setStatus(data.data?.status || "Short Listed");
      } else {
        console.log(data.message || "Application not found");
      }
    } catch (error) {
      console.log("Fetch Application Error:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const response = await fetch(
        `https://latestjobportal.onrender.com/api/update-application/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            status,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Application Updated Successfully");

        setShowModal(false);

        // Updated data dobara fetch karo
        await fetchApplication();
      } else {
        alert(data.message || "Unable to update application.");
      }
    } catch (error) {
      console.log("Update Application Error:", error);
      alert("Something went wrong while updating application.");
    } finally {
      setUpdating(false);
    }
  };

  if (!application) {
    return (
      <div className="application-page">
        <div className="application-header">
          <h1 className="application-title">Loading Application...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="application-page">
      {/* ================================
          HEADER
      ================================= */}

      <div className="application-header">
        <h1 className="application-title">
          {application.candidateId?.fullName || "Candidate"}'s Application
        </h1>
      </div>

      {/* ================================
          JOB DETAILS
      ================================= */}

      <div className="details-card">
        <h2 className="section-title">Job Details</h2>

        <table className="application-table">
          <tbody>
            {/* Job Title + Salary */}
            <tr className="table-row">
              <td className="label-cell">
                <b>Job Title</b>
              </td>

              <td className="value-cell">
                {application.jobId?.jobTitle || "N/A"}
              </td>

              <td className="label-cell">
                <b>Salary Package</b>
              </td>

              <td className="value-cell">
                {application.jobId?.salaryPackage || "N/A"}
              </td>
            </tr>

            {/* Job Description */}
            <tr className="table-row">
              <td className="label-cell">
                <b>Job Description</b>
              </td>

              <td className="value-cell">
                {application.jobId?.jobDescription || "N/A"}
              </td>

              <td></td>
              <td></td>
            </tr>

            {/* Location + Skills */}
            <tr className="table-row">
              <td className="label-cell">
                <b>Job Location</b>
              </td>

              <td className="value-cell">
                {application.jobId?.jobLocation || "N/A"}
              </td>

              <td className="label-cell">
                <b>Skills Required</b>
              </td>

              <td className="value-cell">
                {application.jobId?.skillRequired || "N/A"}
              </td>
            </tr>

            {/* Dates */}
            <tr className="table-row">
              <td className="label-cell">
                <b>Apply Date</b>
              </td>

              <td className="value-cell">
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleString("en-IN")
                  : "N/A"}
              </td>

              <td className="label-cell">
                <b>Last Date</b>
              </td>

              <td className="value-cell">
                {application.jobId?.jobExpirationDate
                  ? new Date(
                      application.jobId.jobExpirationDate
                    ).toLocaleDateString("en-IN")
                  : "N/A"}
              </td>
            </tr>

            {/* Status */}
            <tr className="table-row">
              <td className="label-cell">
                <b>Status</b>
              </td>

              <td className="status-cell">
                {application.status || "Not Responded Yet"}
              </td>

              <td></td>
              <td></td>
            </tr>

            {/* Message */}
            <tr className="table-row">
              <td className="label-cell">
                <b>Message</b>
              </td>

              <td className="message-cell" colSpan="3">
                {application.message || "No Message"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================================
          ACTION BUTTON
      ================================= */}

      <div className="action-card">
        <button
          className="action-btn"
          onClick={() => {
            setMessage(application.message || "");
            setStatus(application.status || "Short Listed");
            setShowModal(true);
          }}
        >
          Take Action
        </button>
      </div>

      {/* ================================
          ACTION MODAL
      ================================= */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal-box">
            {/* Modal Header */}
            <div className="modal-header">
              <h3 className="modal-title">Take Action</h3>

              <span
                className="close-icon"
                onClick={() => setShowModal(false)}
              >
                ×
              </span>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="form-row">
                <label className="form-label">Message :</label>

                <textarea
                  className="message-textarea"
                  rows="8"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message for candidate..."
                />
              </div>

              <div className="form-row">
                <label className="form-label">Status :</label>

                <select
                  className="status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Short Listed">Short Listed</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
                disabled={updating}
              >
                Close
              </button>

              <button
                className="update-btn"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

