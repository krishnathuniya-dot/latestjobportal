import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv"; // CSV Export ke liye
import "../css/employerlist.css";

const EmployerList = () => {
  const [employers, setEmployers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchEmployers = async () => {
    try {
      const response = await fetch("http://localhost:2340/api/employer");
      const data = await response.json();
      setEmployers(data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployers(); }, []);

  const filteredData = employers.filter(item => 
    item.companyName.toLowerCase().includes(search.toLowerCase()) || 
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentEmployers = filteredData.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Copy Email Function
  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    alert("Email copied!");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="uk-employer-container">
      <div className="uk-table-wrapper">
        <div className="uk-card-header">
          Employer Lists
          <div style={{ display: "flex", gap: "10px" }}>
            {/* CSV Export Feature */}
            <CSVLink data={employers} filename={"employers_list.csv"} className="btn-action export">Export CSV</CSVLink>
            <input type="text" className="uk-search-input" placeholder="Search..." onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}} />
          </div>
        </div>
        
        <table className="uk-table">
          <thead>
            <tr><th>#</th><th>COMPANY</th><th>PERSON</th><th>EMAIL</th><th>STATUS</th><th>DATE</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {currentEmployers.length > 0 ? currentEmployers.map((item, index) => (
              <tr key={item._id}>
                <td>{indexOfLastItem - itemsPerPage + index + 1}</td>
                <td className="font-bold">{item.companyName}</td>
                <td>{item.personName}</td>
                <td>{item.email}</td>
                <td><span className="badge-status">{item.status || "Active"}</span></td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-action view" onClick={() => { setSelectedEmployer(item); setShowModal(true); }}>View</button>
                  <button className="btn-action delete">Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{textAlign:"center", padding:"20px"}}>No employers found.</td></tr>
            )}
          </tbody>
        </table>

        <div className="uk-pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
        </div>
      </div>

      {showModal && selectedEmployer && (
        <div className="employer-modal-overlay">
          <div className="employer-modal">
            <div className="view-header">
              <span>View Employer Details</span>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <table className="details-table">
              <tbody>
                <tr>
                  <th>Name of Company</th><td>{selectedEmployer.companyName}</td>
                  <th>Company Logo</th><td><img src={`http://localhost:2340/uploads/${selectedEmployer.logo}`} className="company-logo" alt="logo" /></td>
                  <th>Tag Line</th><td>{selectedEmployer.tagline || "N/A"}</td>
                </tr>
                <tr>
                  <th>Concern Person</th><td>{selectedEmployer.personName}</td>
                  <th>Email</th><td>{selectedEmployer.email} <button onClick={() => copyToClipboard(selectedEmployer.email)}>📋</button></td>
                  <th>Status</th><td>{selectedEmployer.status}</td>
                </tr>
                <tr><td colSpan="6" className="description-title">Company Description</td></tr>
                <tr><td colSpan="6">{selectedEmployer.description || "N/A"}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployerList;