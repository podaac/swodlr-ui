import { useState, useEffect, useRef } from 'react';
import { Button, Col, Row} from 'react-bootstrap';
import { ArrowsExpand} from 'react-bootstrap-icons';
import CustomizedProductTable from './GranulesTable';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeActive, setResizeStartLocation, setResizeEndLocation } from './actions/sidebarSlice';
import { mouseLocation } from '../../types/sidebarTypes';
import GenerateProductsModal from './GenerateProductsModal';
import { setShowGenerateProductModalTrue } from './actions/modalSlice';
import GenerateProducts from './GenerateProducts';


const CustomizeProductsSidebar = () => {
    const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
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
            <Row>
                <Col >
                    <h2 className={`${colorModeClass}-text`}>SWOT Products Customization</h2>
                </Col>
            </Row>
            <hr></hr>
            <Row>
                <CustomizedProductTable />
            </Row>
            {/* <Row> */}
                <GenerateProducts />
            {/* </Row> */}
        </Col>
        <GenerateProductsModal />
        <div className='sidebar-resize'  onMouseDown={(event) => handleResizeClickDown(event)}>
            <ArrowsExpand className="sidebar-resize-icon icon-flipped" color="white" size={24} onMouseDown={(event) => handleResizeClickDown(event)}/>
        </div>
    </div>
  );
}

export default CustomizeProductsSidebar;