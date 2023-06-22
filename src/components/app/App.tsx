import React from 'react';
import MainNavbar from '../navbar/MainNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Map from '../map/Map'
import CustomizeProductsFooter from '../misc/CustomizeProductsFooter';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeInactive, setResizeEndLocation, setResizeStartLocation } from '../sidebar/actions/sidebarSlice';
import CustomizeProductsFooterMin from '../misc/CustomizeProductsFooterMin';
import Welcome from '../welcome/Welcome'
import CustomizeProductsSidebar from '../sidebar/CustomizeProductsSidebar';
import { setCurrentPage } from './appSlice';
import GeneratedProductHistory from '../history/GeneratedProductHistory';
import About from '../about/About';

const App = () => {
  const dispatch = useAppDispatch()
  const footerResizeActive = useAppSelector((state) => state.sidebar.footerResizeActive)
  const previousResizeEndLocation = useAppSelector((state) => state.sidebar.resizeEndLocation)
  const footerMinimized = useAppSelector((state) => state.sidebar.footerMinimized)
  const userAuthenticated = useAppSelector((state) => state.app.userAuthenticated)
  const currentPage = useAppSelector((state) => state.app.currentPage)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)

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
  // const userAuthenticated = true

  const authenticatedApplicationView = (
    <>
      <MainNavbar />
      <Map />
      {footerMinimized ? <CustomizeProductsFooterMin /> : <CustomizeProductsSidebar />}
    </>
  )
  
  const unauthenticatedApplicationView = <Welcome />

  const renderAuthenticatedApplicationView = () => {
    let pageToShow
    switch(currentPage) {
      case 'productCustomization':
        pageToShow = (
          <>
            <Map />
            <CustomizeProductsSidebar />
          </>
        )
        break
      case 'generatedProductsHistory':
        pageToShow = <GeneratedProductHistory />
        break
      case 'about':
        pageToShow = <About />
        break
      default:
    }
    return (
      <>
        <MainNavbar  />
        {pageToShow}
      </>
    )
  }

  return (
    <div className={`App ${userAuthenticated ? 'user-authenticated' : ''} ${colorModeClass}-background`} style={{cursor: footerResizeActive ? 'grabbing' : ''}} onMouseUp={(event) => handleFooterResize(event)} onMouseMove={(event) => handleFooterResize(event)}>
      {userAuthenticated ? renderAuthenticatedApplicationView() : unauthenticatedApplicationView}
    </div>
  );
}

export default App;
