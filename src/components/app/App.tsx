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
import { getCurrentUser } from './appSlice';
import { useEffect, useState } from 'react';
import GranuleSelectionAndConfigurationView from '../sidebar/GranuleSelectionAndConfigurationView';
import Joyride from 'react-joyride';

const App = () => {
  const dispatch = useAppDispatch()
  const footerResizeActive = useAppSelector((state) => state.sidebar.footerResizeActive)
  const previousResizeEndLocation = useAppSelector((state) => state.sidebar.resizeEndLocation)
  const userAuthenticated = useAppSelector((state) => state.app.userAuthenticated)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const currentUser = useAppSelector((state) => state.app.currentUser)
  const startTutorial = useAppSelector((state) => state.app.startTutorial)
  const navigate = useNavigate();
  const { search } = useLocation();

  const [joyride, setState] = useState({
    run: startTutorial,
    steps: [
      {
        target: "#customization-tab",
        content: "You are on the customization page. This is where you can add and customize scenes to be generated.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#select-scenes-breadcrumb",
        content: "You are on the select scenes view where scene selection takes place.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#spatial-search-options",
        content: "This is where you can change options when using the map to search for scenes such as changing the date range of scenes being searched.",
        disableBeacon: true,
        placement: 'right' as const,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#spatial-search-map",
        content: "This map allows you to search for scenes by drawing a search area and will display the footprints of scenes once they have been added to your Added Scenes list.",
        disableBeacon: true,
        placement: 'auto' as const,
        styles: {
            options: {
                zIndex: 1000,
                placement: 'right',
                placementBeacon: 'right',
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: ".leaflet-draw-draw-polygon",
        content: "Click here to start the action of drawing a polygon around the area you wish to search for scenes. Note: the scene search within the search area will begin when after completed a closed polygon shape.",
        disableBeacon: true,
        placement: 'left' as const,
        styles: {
            options: {
              zIndex: 1000,
              primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: ".leaflet-draw-edit-edit",
        content: "Click here to edit any existing scene search areas you have already drawn on the map. Note: the area of the polygon you are editing will be re-searched when editing the shape is saved.",
        disableBeacon: true,
        placement: 'left' as const,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: ".leaflet-draw-edit-remove",
        content: "Click here to delete selected search areas on your map. Save after deleting to save changes.",
        disableBeacon: true,
        placement: 'left' as const,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#added-scenes",
        content: "This is where you can manually add scenes and see your currently added scenes. Enter a scene's cycle, pass and scene id then click the Add Scenes button to manually add scenes to be customized and generated.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#remove-granules-button",
        content: "You can also remove added scenes by selecting them in the Remove column and clicking the red Delete button",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#alert-messages",
        content: "Alerts will inform you if your search was successful or if any errors ocurred.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#configure-products-button",
        content: "Click the Configure Products button to proceed to the Configure Options page where you can select options for how your selected scenes can be made into custom products.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#configure-options-breadcrumb",
        content: "You can also click on the Configure Options tab to proceed to the Configure Options view.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#parameter-options",
        content: "This is where you can configure options of how you want the scenes added in the previous view to be generated. Changing these options will affect all scenes in the table below. Hover over the circular info icon for more detailed explanations.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#scenes-to-customize",
        content: "This is this table showing the scenes you can customize. Also shown are the options which are scene specific which are not applied to all the scenes in the list.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#generate-products-button",
        content: "Use this button when you are ready to generate the products in the Scenes to Customize List with your preferred scene options selected.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#my-data-page",
        content: "This page shows you the statuses of products being generated and that have finished generating.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#history-table",
        content: "This table shows more in depth details about the products that are being generated and that have been generated.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      },
      {
        target: "#download-url",
        content: "Visit urls in this column to download your finished product. If it says N/A, check the status because this indicates that the product is not finished generating yet.",
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 1000,
                primaryColor: '#0d6efd',
            }
        }
      }
    ]
  })

  useEffect(() => {
    setState({...joyride, run: startTutorial })

  }, [startTutorial]);

  const handleJoyrideCallback = (data: { action: any; index: any; status: any; type: any; step: any; lifecycle: any; }) => {
    const { action, step, type, lifecycle } = data;
    const stepTarget = step.target
    if (stepTarget === '#configure-options-breadcrumb' && action === 'update') {
      navigate(`/customizeProduct/configureOptions${search}`)
    } else if (stepTarget === '#configure-options-breadcrumb' && action === 'prev') {
      navigate(`/customizeProduct/selectScenes${search}`)
    } else if (stepTarget === '#added-scenes' && action === 'update') {
      navigate(`/customizeProduct/selectScenes?cyclePassScene=1_413_120&showUTMAdvancedOptions=true`)
    } else if (stepTarget === '#customization-tab' && action === 'start') {
      navigate('/customizeProduct/selectScenes')
    } else if ((stepTarget === '#generate-products-button' && action === 'close' && lifecycle === 'complete') || (stepTarget === '#my-data-page' && action === 'next')) {
      navigate(`/generatedProductHistory${search}`)
    } else if (type === 'tour:end') {
      navigate(`/customizeProduct/selectScenes${search}`)
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
    </div>
  );
}

export default App;
