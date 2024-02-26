import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeInactive, setResizeEndLocation, setResizeStartLocation } from '../sidebar/actions/sidebarSlice';
import Welcome from '../welcome/Welcome'
import AuthorizationCodeHandler from '../edl/AuthorizationCodeHandler';
import GeneratedProductHistory from '../history/GeneratedProductHistory';
import About from '../about/About';
import NavbarContainer from '../navbar/NavbarContainer';
import PodaacFooter from '../navbar/PodaacFooter';
import NotFound from '../error/NotFound';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Session } from '../../authentication/session';
import { getCurrentUser, setStartTutorial } from './appSlice';
import { useEffect, useState } from 'react';
import GranuleSelectionAndConfigurationView from '../sidebar/GranuleSelectionAndConfigurationView';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
import { deleteProduct } from '../sidebar/actions/productSlice';
import { tutorialSteps } from '../tutorial/tutorialConstants';
import InteractiveTutorialModal from '../tutorial/InteractiveTutorialModal';
import { setSkipTutorialTrue } from '../sidebar/actions/modalSlice';

const App = () => {
  const dispatch = useAppDispatch()
  const footerResizeActive = useAppSelector((state) => state.sidebar.footerResizeActive)
  const previousResizeEndLocation = useAppSelector((state) => state.sidebar.resizeEndLocation)
  const userAuthenticated = useAppSelector((state) => state.app.userAuthenticated)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const currentUser = useAppSelector((state) => state.app.currentUser)
  const startTutorial = useAppSelector((state) => state.app.startTutorial)
  const addedProducts = useAppSelector((state) => state.product.addedProducts)
  const navigate = useNavigate();
  const { search } = useLocation();

  const [joyride, setState] = useState({
    run: startTutorial,
    steps: tutorialSteps,
    stepIndex: 0
  })
  
  useEffect(() => {
    setState({...joyride, run: startTutorial, stepIndex: 0})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTutorial]);

  const handleJoyrideCallback = (data: { action: any; index: any; status: any; type: any; step: any; lifecycle: any; }) => {
    const { action, step, type, lifecycle, index } = data;
    const stepTarget = step.target
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setState({...joyride, stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    }
    if (stepTarget === '#configure-options-breadcrumb' && action === 'update') {
      navigate(`/customizeProduct/configureOptions${search}`)
    } else if (stepTarget === '#configure-options-breadcrumb' && action === 'prev' && lifecycle === 'complete') {
      navigate(`/customizeProduct/selectScenes${search}`)
    } else if (stepTarget === '#my-data-page' && action === 'prev') {
      navigate(`/customizeProduct/configureOptions${search}`)
    } else if (stepTarget === '#added-scenes' && action === 'update') {
      navigate(`/customizeProduct/selectScenes?cyclePassScene=9_515_130&showUTMAdvancedOptions=true`)
    } else if (stepTarget === '#customization-tab' && action === 'start') {
      navigate('/customizeProduct/selectScenes')
    // } else if ((stepTarget === '#generate-products-button' && action === 'close' && lifecycle === 'complete') || (stepTarget === '#my-data-page' && action === 'next')) {
    } else if ((action === 'next' || action === 'close') && stepTarget === '#my-data-page') {
      navigate(`/generatedProductHistory${search}`)
    } else if (type === 'tour:end') {
      dispatch(setSkipTutorialTrue())
      dispatch(setStartTutorial(false))
      dispatch(deleteProduct(addedProducts.map(product => product.granuleId)))
      navigate(`/customizeProduct/selectScenes`)
    }
  };

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

  const handleSidebarResize = (event: any) => {
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
    <div className={`App ${userAuthenticated ? 'user-authenticated' : ''} ${colorModeClass}-background`} style={{cursor: footerResizeActive ? 'grabbing' : ''}} onMouseUp={(event) => handleSidebarResize(event)} onMouseMove={(event) => handleSidebarResize(event)}>
      <Joyride 
        callback={(data) => handleJoyrideCallback(data)}
        run={joyride.run}
        steps={joyride.steps}
        stepIndex={joyride.stepIndex}
        showProgress
        showSkipButton
        hideCloseButton
        continuous
        scrollToFirstStep
      />
      <Routes>
        <Route path="/" element={ getPageWithFormatting(<Welcome />, false) } />
        <Route path="/edl/code" element={ getPageWithFormatting(<AuthorizationCodeHandler/>, false) } />
        <Route path="/customizeProduct/selectScenes" element={ getPageWithFormatting(<GranuleSelectionAndConfigurationView mode="selectScenes"/>, true) } />
        <Route path="/customizeProduct/configureOptions" element={ getPageWithFormatting(<GranuleSelectionAndConfigurationView mode="configureOptions"/>, true) } />
        <Route path="/generatedProductHistory" element={ getPageWithFormatting(<GeneratedProductHistory/>, true) } />
        <Route path="/about" element={ getPageWithFormatting(<About />, true) } />
        <Route path='*' element={getPageWithFormatting(<NotFound errorCode='404'/>, true)}/>
      </Routes>
      <InteractiveTutorialModal />
    </div>
  );
}

export default App;
