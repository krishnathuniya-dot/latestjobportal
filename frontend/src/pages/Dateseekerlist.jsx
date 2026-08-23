import React, { useState } from "react";
import "../css/date.css";

const Dateseekerlist = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [displayRange, setDisplayRange] = useState({ from: "", to: "" });
  const [isSubmitted, setIsSubmitted] = useState(false); // Naya state
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }

    try {
      const response = await fetch("https://latestjobportal-11.onrender.com/api/candidates-between-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromDate, toDate }),
      });

      const data = await response.json();

      if (data.success) {
        setCandidates(data.data);
        setDisplayRange({ from: fromDate, to: toDate });
        setCurrentPage(1);
        setIsSubmitted(true); // Yahan form ko hide aur table ko dikhane ka trigger
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  const filteredCandidates = candidates.filter((item) => 
    item.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  return (
    <div className="candidateReport">
      <h2 className="pageTitle">Candidates Between Dates Report</h2>
      
      <div className="reportBox">
        {/* Sirf tab dikhega jab search submit nahi hua */}
        {!isSubmitted ? (
          <>
            <div className="reportHeader">Candidates Between Dates Report</div>
            <form className="searchForm" onSubmit={handleSubmit}>
              <div className="inputGroup">
                <input type="date" className="dateField" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="inputGroup">
                <input type="date" className="dateField" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
              <button type="submit" className="submitButton">Search</button>
            </form>
          </>
        ) : (
          // Sirf tab dikhega jab search ho chuka hai (Table View)
          <div className="tableContainer">
            <div className="reportHeader">
               Report from {displayRange.from} to {displayRange.to}
               <button onClick={() => setIsSubmitted(false)} style={{float: 'right', cursor:'pointer'}}>Back</button>
            </div>
            
            <div className="tableControls">
              <span>Show 8 entries</span>
              <span>Search: <input type="text" onChange={(e) => setSearchTerm(e.target.value)} /></span>
            </div>
            
            <table className="dataTable">
              <thead>
                <tr>
                  <th>#</th><th>FULL NAME</th><th>CONTACT</th><th>EMAIL</th><th>STATUS</th><th>DATE</th><th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((item, index) => (
                  <tr key={item._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.fullName}</td>
                    <td>{item.contactNumber}</td>
                    <td>{item.email}</td>
                    <td>Active</td>
                    <td>{item.createdAt}</td>
                    <td>👁️</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="paginationSection">
              <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCandidates.length)} of {filteredCandidates.length}</span>
              <div>
                <button className="pageBtn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
                <span style={{padding: "5px 10px"}}>{currentPage}</span>
                <button className="pageBtn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dateseekerlist;