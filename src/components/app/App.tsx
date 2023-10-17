import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeInactive, setResizeEndLocation, setResizeStartLocation } from '../sidebar/actions/sidebarSlice';
import Welcome from '../welcome/Welcome'
import CustomizeProductsSidebar from '../sidebar/CustomizeProductsSidebar';
import GeneratedProductHistory from '../history/GeneratedProductHistory';
import About from '../about/About';
import NavbarContainer from '../navbar/NavbarContainer';
import PodaacFooter from '../navbar/PodaacFooter';
import { Route, Routes } from 'react-router-dom';
import ErrorPage from '../error/ErrorPage';
const App = () => {
  const dispatch = useAppDispatch()
  const footerResizeActive = useAppSelector((state) => state.sidebar.footerResizeActive)
  const previousResizeEndLocation = useAppSelector((state) => state.sidebar.resizeEndLocation)
  const userAuthenticated = useAppSelector((state) => state.app.userAuthenticated)
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
  

  const getPageWithFormatting = (component: JSX.Element, showMainNavbar: boolean) => {
    return (
      <>
        <NavbarContainer showMainNavbar={showMainNavbar}/>
        {component}
        <PodaacFooter />
      </>
    )
  }

  return (
    <div className={`App ${userAuthenticated ? 'user-authenticated' : ''} ${colorModeClass}-background`} style={{cursor: footerResizeActive ? 'grabbing' : ''}} onMouseUp={(event) => handleFooterResize(event)} onMouseMove={(event) => handleFooterResize(event)}>
      <Routes>
        <Route path="/" element={ getPageWithFormatting(<Welcome />, false) } />
        <Route path="customizeProduct/selectScenes" element={ getPageWithFormatting(<CustomizeProductsSidebar mode="selectScenes"/>, true) } />
        <Route path="customizeProduct/configureOptions" element={ getPageWithFormatting(<CustomizeProductsSidebar mode="configureOptions"/>, true) } />
        <Route path="generatedProductHistory" element={ getPageWithFormatting(<GeneratedProductHistory/>, true) } />
        <Route path="about" element={ getPageWithFormatting(<About />, true) } />
        <Route path="error" element={ getPageWithFormatting(<ErrorPage errorCode='404' />, true) } />
      </Routes>
    </div>
  );
}

export default App;
