// src/components/CommunityFinds.js
import React, { useState, useEffect } from "react";
import { getApprovedSubmissions } from "../services/communitySubmissionsService.js";
import MenuItem from "./MenuItem";

const CommunityFinds = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const data = await getApprovedSubmissions();
        setSubmissions(data);
      } catch (err) {
        setError("Failed to load community submissions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading community submissions...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="card mt-4">
        <div className="card-body text-center">
          <h4 className="card-title">Community Healthy Finds</h4>
          <p className="card-text">No community submissions yet. Be the first to share!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white">
        <h4>Community Healthy Finds</h4>
      </div>
      <div className="card-body">
        <ul className="list-unstyled">
          {submissions.map((submission) => (
            <MenuItem 
              key={submission._id} 
              item={submission.item} 
              restaurantName={submission.restaurantName}
              submitter={submission.submitterInfo && submission.submitterInfo.name} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommunityFinds;