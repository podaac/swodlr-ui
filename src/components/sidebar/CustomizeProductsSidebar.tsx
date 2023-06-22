import { useState, useEffect, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { ArrowsExpand} from 'react-bootstrap-icons';
import GranuleTable from './GranulesTable';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeActive, setResizeStartLocation, setResizeEndLocation } from './actions/sidebarSlice';
import { mouseLocation } from '../../types/sidebarTypes';
import GenerateProducts from './GenerateProducts';
import ProductCustomization from './ProductCustomization';

const CustomizeProductsSidebar = () => {
    const resizeStartLocation = useAppSelector((state) => state.sidebar.resizeStartLocation)
    const resizeEndLocation = useAppSelector((state) => state.sidebar.resizeEndLocation)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const footerRef = useRef<HTMLHeadingElement>(null);
    const [sidebarWidth, setSidebarWidth] = useState('')

    const dispatch = useAppDispatch()

    const handleResizeClickDown = (event: any) => {
        dispatch(setResizeStartLocation({left: event.pageX, top: event.pageY}))
        dispatch(setResizeEndLocation({left: event.pageX, top: event.pageY}))
        dispatch(setResizeActive())
    }

    const calculateSidebarWidthAfterResize = (mouseDownLocation: mouseLocation, mouseUpLocation: mouseLocation, currentSidebarWidth: number): number => {
        const widthDifference = mouseUpLocation.left - mouseDownLocation.left
        return currentSidebarWidth + widthDifference
    }

    useEffect(() => {
        const sidebarWidthNumber = footerRef.current?.clientWidth ? calculateSidebarWidthAfterResize(resizeStartLocation, resizeEndLocation, footerRef.current?.clientWidth) : sidebarWidth
        setSidebarWidth(`${sidebarWidthNumber}px`)
    }, [resizeEndLocation])

  return (
    <div className={`Customize-products-container-sidebar-all Customize-products-container fixed-left ${colorModeClass}-container-background`} style={{width: sidebarWidth}} ref={footerRef}>
        <Col>
            <Row><h3 style={{marginTop: '10px'}}>SWOT On-Demand L2 Raster Generator</h3></Row>
            <hr></hr>
            <div style={{overflowY: 'auto', maxHeight: '75vh'}}>
            <GranuleTable />
            <ProductCustomization />
            </div>
            <hr></hr>
            <GenerateProducts />
        </Col>
        <div className='sidebar-resize shadow'  onMouseDown={(event) => handleResizeClickDown(event)}>
            <ArrowsExpand className="sidebar-resize-icon icon-flipped" color="white" size={24} onMouseDown={(event) => handleResizeClickDown(event)}/>
        </div>
    </div>
  );
}

export default CustomizeProductsSidebar;