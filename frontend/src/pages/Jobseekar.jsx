import React, { useEffect, useState } from "react";
import { Search, Eye, Users, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";
import "../css/jobseekerlist.css";
import { useNavigate } from "react-router-dom";

const Jobseeker = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => { fetchJobseekers(); }, []);

  const fetchJobseekers = async () => {
    try {
      const response = await fetch("https://latestjobportal-11.onrender.com/api/jobseekers");
      const data = await response.json();
      setJobseekers(data);
    } catch (error) { console.log(error); } 
    finally { setLoading(false); }
  };

  const filteredData = jobseekers.filter((item) =>
    item.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    item.email?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <div className="ff-loader">Fetching Jobseekers...</div>;

  return (
    <div className="ff-container">
      <div className="ff-card">
        {/* Header Section */}
        <div className="ff-header">
          <div className="ff-title-group">
            <div className="ff-icon-bg"><Users size={24} /></div>
            <div>
              <h2>Jobseeker Directory</h2>
              <p>Manage and view all registered jobseekers</p>
            </div>
          </div>
          
          <div className="ff-search-wrapper">
            <Search size={18} className="ff-search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="ff-table-container">
          <table className="ff-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Joined</th>
                <th style={{textAlign: "center"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map((item) => (
                <tr key={item._id}>
                  <td><div className="ff-avatar"><UserCircle size={32} /></div></td>
                  <td className="ff-name">{item.fullName}</td>
                  <td>{item.contactNumber || <span className="ff-na">N/A</span>}</td>
                  <td className="ff-email">{item.email}</td>
                  <td className="ff-date">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td style={{textAlign: "center"}}>
                    <button className="ff-view-btn" onClick={() => navigate(`/fulldetails/${item._id}`)}>
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="ff-no-data">No results found</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ff-pagination">
          <span>Page {currentPage} of {totalPages || 1}</span>
          <div className="ff-pagination-btns">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={16}/></button>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Jobseeker;