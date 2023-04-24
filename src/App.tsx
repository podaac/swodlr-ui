import React from 'react';
import MainNavbar from './components/navbar/MainNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Map from './components/map/Map'
import CustomizeProductsFooter from './components/footer/CustomizeProductsFooter';
import { useAppSelector, useAppDispatch } from './redux/hooks'
import { setResizeInactive, setResizeEndLocation, setResizeStartLocation } from './components/footer/customizeProductsFooterSlice';
import CustomizeProductsFooterMin from './components/footer/CustomizeProductsFooterMin';

const App = () => {
  const dispatch = useAppDispatch()
  const footerResizeActive = useAppSelector((state) => state.customizeProductsFooter.footerResizeActive)
  const previousResizeEndLocation = useAppSelector((state) => state.customizeProductsFooter.resizeEndLocation)
  const footerMinimized = useAppSelector((state) => state.customizeProductsFooter.footerMinimized)

  const handleFooterResize = (event: any) => {
    if (footerResizeActive) {
      if (event.type === 'mouseup') {
        dispatch(setResizeInactive())
      } else if (event.type === 'mousemove') {
        dispatch(setResizeStartLocation(previousResizeEndLocation))
        dispatch(setResizeEndLocation({left: event.pageX, top: event.pageY}))
      }
    }
  }

  return (
    <div className="App" style={{cursor: footerResizeActive ? 'grabbing' : ''}} onMouseUp={(event) => handleFooterResize(event)} onMouseMove={(event) => handleFooterResize(event)}>
      <MainNavbar />
      <Map />
      {footerMinimized ? <CustomizeProductsFooterMin /> : <CustomizeProductsFooter />}
    </div>
  );
}

export default App;
