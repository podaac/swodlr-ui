import { useState, useEffect, useRef } from 'react';
import { Button, Col, Row} from 'react-bootstrap';
import { ArrowsExpand, ChevronDown, Plus } from 'react-bootstrap-icons';
import CustomizedProductTable from './ProductsTable';
import AddProductModal from './AddCustomProductModal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowAddProductModalTrue } from './customProductModalSlice'
import { setResizeActive, setResizeStartLocation, setFooterMinimized } from './customizeProductsFooterSlice';
import { mouseLocation } from '../../types/customizeProductsFooterTypes';
import AddGranules from './AddGranules';

const CustomizeProductsSidebar = () => {
    const footerResizeActive = useAppSelector((state) => state.customizeProductsFooter.footerResizeActive)
    const resizeStartLocation = useAppSelector((state) => state.customizeProductsFooter.resizeStartLocation)
    const resizeEndLocation = useAppSelector((state) => state.customizeProductsFooter.resizeEndLocation)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const footerRef = useRef<HTMLHeadingElement>(null);
    const [footerHeight, setFooterHeight] = useState('auto')
    const dispatch = useAppDispatch()

    const handleResizeClickDown = (event: any) => {
        dispatch(setResizeStartLocation({left: event.pageX, top: event.pageY}))
        dispatch(setResizeActive())
    }

    const calculateFooterHeightAfterResize = (mouseDownLocation: mouseLocation, mouseUpLocation: mouseLocation, currentFooterHeight: number): number => {
        const heightDifference = mouseUpLocation.top - mouseDownLocation.top
        return currentFooterHeight - heightDifference
    }

    useEffect(() => {
        const footerHeightNumber = footerRef.current?.clientHeight ? calculateFooterHeightAfterResize(resizeStartLocation, resizeEndLocation, footerRef.current?.clientHeight) : footerHeight
        setFooterHeight(`${footerHeightNumber}px`)
    }, [resizeEndLocation])

  return (
    <div className={`Customize-products-container-sidebar-all Customize-products-container fixed-left ${colorModeClass}-background`} ref={footerRef}>
        <Row style={{height: '100%'}}>
            <Col sm={11}>
                <Row>
                    <Col >
                        <h2 className={`${colorModeClass}-text`}>SWOT Products Customization</h2>
                    </Col>
                    {/* <Col md={{ span: 1, offset: 2 }}>
                        <ChevronDown className={`${colorModeClass}-text`} style={{cursor: 'pointer'}} size={36} onClick={() => dispatch(setFooterMinimized())}/>
                    </Col> */}
                </Row>
                <Row>
                    <AddGranules />
                </Row>
                <Row>
                    <h3 className={`${colorModeClass}-text`}>Granule Table</h3>
                </Row>
                <Row>
                    <CustomizedProductTable />
                </Row>
                <Row>
                    <Col>
                        <Button variant="success" onClick={() => dispatch(setShowAddProductModalTrue())}>
                            Generate Products
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
            <Col sm={1} style={{position: 'relative'}}>
                <Row style={{margin: 0, position: 'absolute', top: '50%'}}>
                    <ArrowsExpand className="Footer-resize icon-flipped" style={{cursor: footerResizeActive ? 'grabbing' : 'grab'}} color="white" size={24} onMouseDown={(event) => handleResizeClickDown(event)}/>
                </Row>
            </Col>
        </Row>
        {/* <AddProductModal/> */}
    </div>
  );
}

export default CustomizeProductsSidebar;