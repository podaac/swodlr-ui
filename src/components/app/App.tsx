import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeInactive, setResizeEndLocation, setResizeStartLocation } from '../sidebar/actions/sidebarSlice';
import Welcome from '../welcome/Welcome'
import AuthorizationCodeHandler from '../edl/AuthorizationCodeHandler';
import CustomizeProductsSidebar from '../sidebar/CustomizeProductsSidebar';
import GeneratedProductHistory from '../history/GeneratedProductHistory';
import About from '../about/About';
import NavbarContainer from '../navbar/NavbarContainer';
import PodaacFooter from '../navbar/PodaacFooter';
import NotFound from '../error/NotFound';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Session } from '../../authentication/session';
import { getCurrentUser } from './appSlice';
import { useEffect } from 'react';
import GranuleSelectionAndConfigurationView from '../sidebar/GranuleSelectionAndConfigurationView';

const App = () => {
  const dispatch = useAppDispatch()
  const footerResizeActive = useAppSelector((state) => state.sidebar.footerResizeActive)
  const previousResizeEndLocation = useAppSelector((state) => state.sidebar.resizeEndLocation)
  const userAuthenticated = useAppSelector((state) => state.app.userAuthenticated)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const navigate = useNavigate();

    useEffect(() => {
      // If a session was found
      Session.getCurrent().then((session) => {
        if (session !== null) {
          if (currentUser === null) {
            dispatch(getCurrentUser());
          }
        } else {
          // navigate to welcome page if user isn't authenticated
          navigate('/')
        }
      });
    }, [dispatch, navigate, currentUser]);

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
        <Route path="/edl/code" element={ getPageWithFormatting(<AuthorizationCodeHandler/>, false) } />
        <Route path="/customizeProduct/selectScenes" element={ getPageWithFormatting(<GranuleSelectionAndConfigurationView mode="selectScenes"/>, true) } />
        <Route path="/customizeProduct/configureOptions" element={ getPageWithFormatting(<GranuleSelectionAndConfigurationView mode="configureOptions"/>, true) } />
        <Route path="/generatedProductHistory" element={ getPageWithFormatting(<GeneratedProductHistory/>, true) } />
        <Route path="/about" element={ getPageWithFormatting(<About />, true) } />
        <Route path='*' element={getPageWithFormatting(<NotFound errorCode='404'/>, true)}/>
      </Routes>
    </div>
  );
}

export default App;
