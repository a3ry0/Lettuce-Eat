// src/components/CommunitySubmission.js
import React, { useState } from "react";
import { submitCommunityItem } from "../services/communitySubmissionsService.js";

const CommunitySubmission = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    item: {
      name: "",
      calories: "",
      ingredients: "",
      protein: "",
      carbs: "",
      fats: ""
    },
    submitterInfo: {
      name: "",
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("item.")) {
      const itemField = name.split(".")[1];
      setFormData({
        ...formData,
        item: {
          ...formData.item,
          [itemField]: value
        }
      });
    } else if (name.startsWith("submitterInfo.")) {
      const infoField = name.split(".")[1];
      setFormData({
        ...formData,
        submitterInfo: {
          ...formData.submitterInfo,
          [infoField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Convert numeric fields from strings to numbers
    const numericData = {
      ...formData,
      item: {
        ...formData.item,
        calories: parseFloat(formData.item.calories) || 0,
        protein: parseFloat(formData.item.protein) || 0,
        carbs: parseFloat(formData.item.carbs) || 0,
        fats: parseFloat(formData.item.fats) || 0
      }
    };
    
    try {
      await submitCommunityItem(numericData);
      setSuccess(true);
      // Reset form
      setFormData({
        restaurantName: "",
        item: {
          name: "",
          calories: "",
          ingredients: "",
          protein: "",
          carbs: "",
          fats: ""
        },
        submitterInfo: {
          name: "",
        }
      });
    } catch (err) {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4>Submit a Healthy Menu Item</h4>
      </div>
      <div className="card-body">
        {success && (
          <div className="alert alert-success">
            Thank you for your submission! Our team will review it soon.
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="restaurantName" className="form-label">Restaurant Name</label>
            <input
              type="text"
              className="form-control"
              id="restaurantName"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="item.name" className="form-label">Item Name</label>
            <input
              type="text"
              className="form-control"
              id="item.name"
              name="item.name"
              value={formData.item.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="item.calories" className="form-label">Calories</label>
            <input
              type="number"
              className="form-control"
              id="item.calories"
              name="item.calories"
              value={formData.item.calories}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="item.ingredients" className="form-label">Ingredients</label>
            <textarea
              className="form-control"
              id="item.ingredients"
              name="item.ingredients"
              value={formData.item.ingredients}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="item.protein" className="form-label">Protein (g)</label>
                <input
                  type="number"
                  className="form-control"
                  id="item.protein"
                  name="item.protein"
                  value={formData.item.protein}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="item.carbs" className="form-label">Carbs (g)</label>
                <input
                  type="number"
                  className="form-control"
                  id="item.carbs"
                  name="item.carbs"
                  value={formData.item.carbs}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="item.fats" className="form-label">Fats (g)</label>
                <input
                  type="number"
                  className="form-control"
                  id="item.fats"
                  name="item.fats"
                  value={formData.item.fats}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <hr />
          
          <div className="mb-3">
            <label htmlFor="submitterInfo.name" className="form-label">Your Name (Optional)</label>
            <input
              type="text"
              className="form-control"
              id="submitterInfo.name"
              name="submitterInfo.name"
              value={formData.submitterInfo.name}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunitySubmission;