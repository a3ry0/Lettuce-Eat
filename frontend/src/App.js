// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import RestaurantSearch from './components/RestaurantSearch';
import RestaurantDetails from './components/RestaurantDetails';
import FavoritesPage from './components/FavoritesPage';
import AllRestaurants from './components/AllRestaurants';
import Navigation from './components/Navigation';
import CommunityFinds from './components/CommunityFinds';
import CommunitySubmission from './components/CommunitySubmission';

function App() {
  return (
    <Router>
      <div className="container">
        <header className="text-center my-4">
          <h1 className="display-4">Lettuce Eat!</h1>
          <p className="lead text-muted">Find healthy options at your favorite restaurants</p>
        </header>

        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<AllRestaurants />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/restaurant/:name" element={<RestaurantDetailsWrapper />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>

        <footer className="my-5 pt-5 text-muted text-center text-small">
          <p className="mb-1">&copy; 2025 Audrey Do</p>
        </footer>
      </div>
    </Router>
  );
}

// Home page component
const HomePage = () => {
  return (
    <div>
      <RestaurantSearch
        onSelectRestaurant={(restaurant) => {
          window.location.href = `/restaurant/${encodeURIComponent(restaurant.name)}`;
        }}
      />
    </div>
  );
};

// Community page component
const CommunityPage = () => {
  return (
    <div>
      <h2 className="text-center mb-4">Community Health Finds</h2>
      <div className="row">
        <div className="col-md-8 mb-4">
          <CommunityFinds />
        </div>
        <div className="col-md-4 mb-4">
          <CommunitySubmission />
        </div>
      </div>
    </div>
  );
};

// Wrapper to pass URL params to RestaurantDetails
const RestaurantDetailsWrapper = () => {
  const { name } = useParams();
  return <RestaurantDetails restaurantName={name} />;
};

export default App;