import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/applicationdetail.css";

export default function Applicationpage() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Short Listed");

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await fetch(
        `http://localhost:2340/api/application-details/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setApplication(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:2340/api/update-application/${id}`,
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
        fetchApplication();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!application) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="application-page">
  <div className="application-header">
    <h1 className="application-title">
      {application.candidateId?.fullName}'s Application
    </h1>
  </div>

  <div className="details-card">
    <h2 className="section-title">Job Details</h2>

    <table className="application-table">
      <tbody>
        <tr className="table-row">
          <td className="label-cell"><b>Job Title</b></td>
          <td className="value-cell">{application.jobId?.jobTitle}</td>

          <td className="label-cell"><b>Salary Package</b></td>
          <td className="value-cell">{application.jobId?.salaryPackage}</td>
        </tr>

        <tr className="table-row">
          <td className="label-cell"><b>Job Description</b></td>
          <td className="value-cell">
            {application.jobId?.jobDescription}
          </td>
          <td></td>
          <td></td>
        </tr>

        <tr className="table-row">
          <td className="label-cell"><b>Job Location</b></td>
          <td className="value-cell">{application.jobId?.jobLocation}</td>

          <td className="label-cell"><b>Skills Required</b></td>
          <td className="value-cell">{application.jobId?.skillRequired}</td>
        </tr>

        <tr className="table-row">
          <td className="label-cell"><b>Apply Date</b></td>
          <td className="value-cell">
            {new Date(application.createdAt).toLocaleString()}
          </td>

          <td className="label-cell"><b>Last Date</b></td>
          <td className="value-cell">
            {application.jobId?.jobExpirationDate
              ? new Date(
                  application.jobId.jobExpirationDate
                ).toLocaleDateString()
              : "N/A"}
          </td>
        </tr>

        <tr className="table-row">
          <td className="label-cell"><b>Status</b></td>
          <td className="status-cell">
            {application.status || "Not Responded Yet"}
          </td>
          <td></td>
          <td></td>
        </tr>

        <tr className="table-row">
          <td className="label-cell"><b>Message</b></td>
          <td className="message-cell" colSpan="3">
            {application.message || "No Message"}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div className="action-card">
    <button
      className="action-btn"
      onClick={() => setShowModal(true)}
    >
      Take Action
    </button>
  </div>

  {showModal && (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h3 className="modal-title">Take Action</h3>

          <span
            className="close-icon"
            onClick={() => setShowModal(false)}
          >
            ×
          </span>
        </div>

        <div className="modal-body">

          <div className="form-row">
            <label className="form-label">Message :</label>

            <textarea
              className="message-textarea"
              rows="8"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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

        <div className="modal-footer">
          <button
            className="close-btn"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>

          <button
            className="update-btn"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>

      </div>
    </div>
  )}
</div>
  );
}