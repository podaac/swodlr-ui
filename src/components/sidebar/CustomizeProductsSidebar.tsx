import { useState, useEffect, useRef } from 'react';
import { Button, Col, Row, Tab, Tabs} from 'react-bootstrap';
import { ArrowsExpand} from 'react-bootstrap-icons';
import GranuleTable from './GranulesTable';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeActive, setResizeStartLocation, setResizeEndLocation, setActiveTab } from './actions/sidebarSlice';
import { mouseLocation } from '../../types/sidebarTypes';
import GenerateProducts from './GenerateProducts';
import ProductActionBar from './ProductActionBar';
import GeneratedProductHistory from './GeneratedProductHistory';
import { TabTypes } from '../../types/constantTypes';

const CustomizeProductsSidebar = () => {
    const resizeStartLocation = useAppSelector((state) => state.sidebar.resizeStartLocation)
    const resizeEndLocation = useAppSelector((state) => state.sidebar.resizeEndLocation)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const activeTab = useAppSelector((state) => state.sidebar.activeTab)
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

    const renderSidebarContents = () => {
        if (activeTab === 'productCustomization') {
            return (
                <>
                    <GranuleTable />
                    <GenerateProducts />
                    {/* <ProductActionBar /> */}
                </>
            )
        } else if (activeTab === 'productHistory') {
            return (
                <>
                    <GeneratedProductHistory />
                </>
            )
        }
    }

    const getTabClass = (tabId: TabTypes) => {
        return tabId === activeTab ? `${colorModeClass}-active-tab` : `${colorModeClass}-inactive-tab` 
    }

  return (
    <div className={`Customize-products-container-sidebar-all Customize-products-container fixed-left ${colorModeClass}-container-background`} style={{width: sidebarWidth}} ref={footerRef}>
        <Col>
            {/* <Row><h3 style={{marginTop: '10px', marginBottom: '20px'}}>SWOT On-Demand L2 Raster Generator</h3></Row> */}
            <Row>
                <Button id="productCustomization" className={`product-tab ${getTabClass('productCustomization')} shadow`} style={{height: '50px', width: '200px', marginTop: '10px'}} onClick={() => dispatch(setActiveTab('productCustomization'))}>Product Customization</Button>
                <Button id="productHistory" className={`product-tab ${getTabClass('productHistory')} shadow`} style={{height: '50px', width: '200px', marginTop: '10px'}} onClick={() => dispatch(setActiveTab('productHistory'))}>Product History</Button>
                <hr className={`${colorModeClass}-text`} style={{marginTop: '0px', backgroundColor: 'black', borderWidth: '1px', opacity: 1}} />
            </Row>
            {renderSidebarContents()}
        </Col>
        <div className='sidebar-resize'  onMouseDown={(event) => handleResizeClickDown(event)}>
            <ArrowsExpand className="sidebar-resize-icon icon-flipped" color="white" size={24} onMouseDown={(event) => handleResizeClickDown(event)}/>
        </div>
    </div>
  );
}

export default CustomizeProductsSidebar;