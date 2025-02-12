// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your components and the new Navigation component
import RestaurantSearch from './components/RestaurantSearch';
import RestaurantDetails from './components/RestaurantDetails';
import FavoritesPage from './components/FavoritesPage';
import AllRestaurants from './components/AllRestaurants';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="container">
        <header className="text-center my-4">
          <h1 className="display-4">Lettuce Eat!</h1>
        </header>

        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<AllRestaurants />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/restaurant/:name" element={<RestaurantDetailsWrapper />} />
        </Routes>
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

// Wrapper to pass URL params to RestaurantDetails
const RestaurantDetailsWrapper = () => {
  const { name } = useParams();
  return <RestaurantDetails restaurantName={name} />;
};

export default App;