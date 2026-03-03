import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [myComplaints, setMyComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          axios.get("http://localhost:5000/api/complaints"),
          axios.get(
            "http://localhost:5000/api/complaints/my-accepted",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setAllComplaints(allRes.data);
        setMyComplaints(myRes.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const total = allComplaints.length;
  const pending = allComplaints.filter(c => c.status === "Pending").length;
  const accepted = allComplaints.filter(c => c.status === "Accepted").length;
  const resolved = allComplaints.filter(c => c.status === "Resolved").length;

  if (loading) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Volunteer Dashboard</h2>

      {/* ===== Stats Cards ===== */}
      <div className="stats-container">
        <div className="stat-card">
          <h4>Total</h4>
          <p>{total}</p>
        </div>
        <div className="stat-card pending">
          <h4>Pending</h4>
          <p>{pending}</p>
        </div>
        <div className="stat-card accepted">
          <h4>Accepted</h4>
          <p>{accepted}</p>
        </div>
        <div className="stat-card resolved">
          <h4>Resolved</h4>
          <p>{resolved}</p>
        </div>
      </div>

      {/* ===== My Accepted Complaints ===== */}
      <div className="section">
        <h3>My Accepted Complaints</h3>
        <div className="complaints-grid">
          {myComplaints.length === 0 ? (
            <p>No complaints accepted yet.</p>
          ) : (
            myComplaints.map((complaint) => (
              <div className="complaint-card" key={complaint._id}>
                <h4>{complaint.title}</h4>
                <p>{complaint.description}</p>
                <span className={`status ${complaint.status.toLowerCase()}`}>
                  {complaint.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== All Complaints ===== */}
      <div className="section">
        <h3>All Complaints</h3>
        <div className="complaints-grid">
          {allComplaints.map((complaint) => (
            <div className="complaint-card" key={complaint._id}>
              <h4>{complaint.title}</h4>
              <p>{complaint.description}</p>

              <span className={`status ${complaint.status.toLowerCase()}`}>
                {complaint.status}
              </span>

              {complaint.acceptedBy && (
                <p className="accepted-by">
                  Accepted by: {complaint.acceptedBy.name}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;