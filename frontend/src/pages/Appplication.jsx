import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/applicationdetail.css";

export default function Appplication() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await fetch(
        `https://latestjobportal-11.onrender.com/api/application-details/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setApplication(data.data);
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

      <div className="header">
        <h1>
          {application.candidateId?.fullName}'s Application
        </h1>
      </div>

      <div className="details-card">
        <h2>Jobs Details</h2>

        <table>
          <tbody>

            <tr>
              <td><b>Job Title</b></td>
              <td>{application.jobId?.jobTitle}</td>

              <td><b>Salary Package</b></td>
              <td>{application.jobId?.salaryPackage}</td>
            </tr>

            <tr>
              <td><b>Job Description</b></td>
              <td>{application.jobId?.jobDescription}</td>

              <td></td>
              <td></td>
            </tr>

            <tr>
              <td><b>Job Location</b></td>
              <td>{application.jobId?.jobLocation}</td>

              <td><b>Skills Required</b></td>
              <td>{application.jobId?.skillRequired}</td>
            </tr>

            <tr>
              <td><b>Apply Date</b></td>
              <td>
                {new Date(
                  application.createdAt
                ).toLocaleString()}
              </td>

              <td><b>Last Date</b></td>
              <td>
                {application.jobId?.jobExpirationDate
                  ? new Date(
                      application.jobId.jobExpirationDate
                    ).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>

            <tr>
              <td><b>Status</b></td>
              <td>
                {application.status ||
                  "Not Responded Yet"}
              </td>

              <td></td>
              <td></td>
            </tr>

            <tr>
              <td><b>Message</b></td>
              <td colSpan="3">
                {application.message ||
                  "No Message From Recruiter"}
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
}