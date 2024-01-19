import { useState, useEffect, useRef } from 'react';
import { Col } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeActive, setResizeStartLocation, setResizeEndLocation, setSidebarWidth } from './actions/sidebarSlice';
import { mouseLocation } from '../../types/sidebarTypes';
import SidebarBreadcrumbs from './SidebarBreadcrumbs';
import CustomizeProductView from './CustomizeProductView';
import GranuleSelectionView from './GranuleSelectionView';
import { CustomizeProductSidebarProps } from '../../types/constantTypes';
import { ArrowsExpand } from 'react-bootstrap-icons';
import InteractiveTutorialModal from '../tutorial/InteractiveTutorialModal';

const CustomizeProductsSidebar = (props: CustomizeProductSidebarProps) => {
    const { mode } = props
    const resizeStartLocation = useAppSelector((state) => state.sidebar.resizeStartLocation)
    const resizeEndLocation = useAppSelector((state) => state.sidebar.resizeEndLocation)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const footerRef = useRef<HTMLHeadingElement>(null);
    const [sidebarWidthLocal, setLocalSidebarWidth] = useState((footerRef.current?.clientWidth as number)/2)

    const dispatch = useAppDispatch()

    const handleResizeClickDown = (event: any) => {
        dispatch(setResizeStartLocation({left: event.pageX, top: event.pageY}))
        dispatch(setResizeEndLocation({left: event.pageX, top: event.pageY}))
        dispatch(setResizeActive())
    }

    const renderSidebarContents = () => {
        if (mode as string === 'selectScenes') {
            return (
                <GranuleSelectionView />
            )
        } else if (mode as string === 'configureOptions') {
            return (
                <CustomizeProductView />
            )
        }
    }

    const calculateSidebarWidthAfterResize = (mouseDownLocation: mouseLocation, mouseUpLocation: mouseLocation, currentSidebarWidth: number): number => {
        const widthDifference = mouseUpLocation.left - mouseDownLocation.left
        return currentSidebarWidth + widthDifference
    }

    useEffect(() => {
        const sidebarWidthNumber = footerRef.current?.clientWidth ? calculateSidebarWidthAfterResize(resizeStartLocation, resizeEndLocation, footerRef.current?.clientWidth) : sidebarWidthLocal
        setLocalSidebarWidth(sidebarWidthNumber)
        setSidebarWidth(sidebarWidthNumber)

    }, [resizeEndLocation])

  return (
    <div className={`Customize-products-container-sidebar-all Customize-products-container fixed-left ${colorModeClass}-container-background`} style={{width: `${sidebarWidthLocal}px`}} ref={footerRef}>
        <Col style={{overflowY: 'auto', height: '100%'}}>
            <SidebarBreadcrumbs />
            <div style={{}}>
            {renderSidebarContents()}
            </div>
        </Col>

        {/* TODO: uncomment when granule footprints are being retrieved to display on map */}
        <div className='sidebar-resize shadow'  onMouseDown={(event) => handleResizeClickDown(event)}>
            <ArrowsExpand className="sidebar-resize-icon icon-flipped" color="white" size={24} onMouseDown={(event) => handleResizeClickDown(event)}/>
        </div>
        <InteractiveTutorialModal />
    </div>
  );
}

export default CustomizeProductsSidebar;