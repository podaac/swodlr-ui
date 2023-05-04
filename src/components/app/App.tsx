import React from 'react';
import MainNavbar from '../navbar/MainNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Map from '../map/Map'
import CustomizeProductsFooter from '../sidebar/CustomizeProductsFooter';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeInactive, setResizeEndLocation, setResizeStartLocation } from '../sidebar/customizeProductsFooterSlice';
import CustomizeProductsFooterMin from '../sidebar/CustomizeProductsFooterMin';
import Welcome from '../welcome/Welcome'
import CustomizeProductsSidebar from '../sidebar/CustomizeProductsSidebar';

const App = () => {
  const dispatch = useAppDispatch()
  const footerResizeActive = useAppSelector((state) => state.customizeProductsFooter.footerResizeActive)
  const previousResizeEndLocation = useAppSelector((state) => state.customizeProductsFooter.resizeEndLocation)
  const footerMinimized = useAppSelector((state) => state.customizeProductsFooter.footerMinimized)
  // const userAuthenticated = useAppSelector((state) => state.app.userAuthenticated)

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

  // can use this for testing purposes
  const userAuthenticated = true

  const authenticatedApplicationView = (
    <>
      <MainNavbar />
      <Map />
      {footerMinimized ? <CustomizeProductsFooterMin /> : <CustomizeProductsSidebar />}
    </>
  )
  
  const unauthenticatedApplicationView = <Welcome />

  return (
    <div className={`App ${userAuthenticated ? 'user-authenticated' : ''}`} style={{cursor: footerResizeActive ? 'grabbing' : ''}} onMouseUp={(event) => handleFooterResize(event)} onMouseMove={(event) => handleFooterResize(event)}>
      {userAuthenticated ? authenticatedApplicationView : unauthenticatedApplicationView}
    </div>
  );
}

export default App;
