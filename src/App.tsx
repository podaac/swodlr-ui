import React from 'react';
import MainNavbar from './components/navbar/MainNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Map from './components/map/Map'
import CustomizeProductsFooter from './components/footer/CustomizeProductsFooter';

function App() {
  return (
    <div className="App">
      <MainNavbar />
      <Map />
      <CustomizeProductsFooter />
    </div>
  );
}

export default App;
