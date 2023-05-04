import { useState, useEffect, useRef } from 'react';
import { Button, Col, Row} from 'react-bootstrap';
import { ArrowsExpand} from 'react-bootstrap-icons';
import CustomizedProductTable from './ProductsTable';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setResizeActive, setResizeStartLocation, setResizeEndLocation } from './customizeProductsFooterSlice';
import { mouseLocation } from '../../types/customizeProductsFooterTypes';
import GenerateProductsModal from './GenerateProductsModal';
import { setShowGenerateProductModalTrue } from './customProductModalSlice';


const CustomizeProductsSidebar = () => {
    const selectedGranules = useAppSelector((state) => state.customProductModal.selectedGranules)
    const resizeStartLocation = useAppSelector((state) => state.customizeProductsFooter.resizeStartLocation)
    const resizeEndLocation = useAppSelector((state) => state.customizeProductsFooter.resizeEndLocation)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const footerRef = useRef<HTMLHeadingElement>(null);
    const [sidebarWidth, setSidebarWidth] = useState('')
    const dispatch = useAppDispatch()

    const handleResizeClickDown = (event: any) => {
        console.log(event.pageX)
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
        {/* <Row style={{height: '100%'}}> */}
            <Col>
                <Row>
                    <Col >
                        <h2 className={`${colorModeClass}-text`}>SWOT Products Customization</h2>
                    </Col>
                    {/* <Col md={{ span: 1, offset: 2 }}>
                        <ChevronDown className={`${colorModeClass}-text`} style={{cursor: 'pointer'}} size={36} onClick={() => dispatch(setFooterMinimized())}/>
                    </Col> */}
                </Row>
                <hr></hr>
                {/* <Row>
                    <AddGranules />
                </Row> */}
                <Row>
                    <CustomizedProductTable />
                </Row>
                <Row>
                    <Col>
                        <Button disabled={selectedGranules.length === 0} variant="success" onClick={() => dispatch(setShowGenerateProductModalTrue())}>
                            Generate Selected Products
                        </Button>
                    </Col>
                </Row>
                {/* <Row>
                    <Col>
                        <Button variant="success" onClick={() => dispatch(setShowAddProductModalTrue())}>
                            <Plus size={24}/> Add Custom Product
                        </Button>
                    </Col>
                </Row> */}
            </Col>
            {/* style={{cursor: footerResizeActive ? 'grabbing' : 'grab'}} */}
            <GenerateProductsModal />
            <div className='sidebar-resize'  onMouseDown={(event) => handleResizeClickDown(event)}>
                <ArrowsExpand className="sidebar-resize-icon icon-flipped" color="white" size={24} onMouseDown={(event) => handleResizeClickDown(event)}/>
            </div>
            {/* <Col sm={1} style={{position: 'relative'}}>
                <Row style={{margin: 0, position: 'absolute', top: '50%'}}>
                    <ArrowsExpand className="Footer-resize icon-flipped" style={{cursor: footerResizeActive ? 'grabbing' : 'grab'}} color="white" size={24} onMouseDown={(event) => handleResizeClickDown(event)}/>
                </Row>
            </Col> */}
        {/* </Row> */}
        {/* <AddProductModal/> */}
    </div>
  );
}

export default CustomizeProductsSidebar;