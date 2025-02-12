// src/components/MenuItem.js
import React, { useState } from "react";

const MenuItem = ({
  item,
  restaurantName,
  onAction,
  actionLabel = "Favorite",
  actionClass,
}) => {
  // Always call hooks first
  const [expanded, setExpanded] = useState(false);

  // Then conditionally return if item is not defined
  if (!item) {
    console.error("MenuItem received an undefined item.");
    return null;
  }

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <li
      style={{
        marginBottom: "10px",
        borderBottom: "1px solid #ccc",
        paddingBottom: "10px",
      }}
    >
      <div
        onClick={toggleExpanded}
        style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
      >
        <span>
          {restaurantName && <em>{restaurantName}: </em>}
          {item.name || "Unnamed Item"} - {item.calories || "N/A"} calories
        </span>
        <span>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div style={{ marginLeft: "20px", marginTop: "5px" }}>
          <p>
            <strong>Ingredients:</strong> {item.ingredients || "N/A"}
          </p>
          <p>
            <strong>Protein:</strong>{" "}
            {item.protein !== undefined ? `${item.protein}g` : "N/A"}
          </p>
          <p>
            <strong>Carbs:</strong>{" "}
            {item.carbs !== undefined ? `${item.carbs}g` : "N/A"}
          </p>
          <p>
            <strong>Fats:</strong>{" "}
            {item.fats !== undefined ? `${item.fats}g` : "N/A"}
          </p>
          {onAction && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent bubbling if needed
                onAction();
              }}
              className={actionClass || "btn btn-success"}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </li>
  );
};

export default MenuItem;