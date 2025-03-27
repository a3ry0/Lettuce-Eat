// src/services/communitySubmissionsService.js

const SUBMISSIONS_API_URL = "http://localhost:7001/api/submissions";

export const getApprovedSubmissions = async () => {
  try {
    const response = await fetch(`${SUBMISSIONS_API_URL}/approved`);
    if (!response.ok) {
      throw new Error("Failed to fetch approved submissions");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching approved submissions:", error);
    return [];
  }
};

export const submitCommunityItem = async (data) => {
  try {
    const response = await fetch(SUBMISSIONS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Failed to submit item");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error submitting item:", error);
    throw error;
  }
};

// Admin functions (would be restricted in a real app)
export const getAllSubmissions = async (status = null) => {
  try {
    const url = status 
      ? `${SUBMISSIONS_API_URL}?status=${status}` 
      : SUBMISSIONS_API_URL;
      
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch submissions");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};

export const updateSubmissionStatus = async (id, status) => {
  try {
    const response = await fetch(`${SUBMISSIONS_API_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to update submission");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error updating submission:", error);
    throw error;
  }
};