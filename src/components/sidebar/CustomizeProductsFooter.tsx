import { useState, useEffect, useRef } from 'react';
import { Button, Col, Row} from 'react-bootstrap';
import { ChevronDown, Plus } from 'react-bootstrap-icons';
import CustomizedProductTable from './ProductsTable';
import AddProductModal from './AddCustomProductModal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowAddProductModalTrue } from './customProductModalSlice'
import { setResizeActive, setResizeStartLocation, setFooterMinimized } from './customizeProductsFooterSlice';
import { mouseLocation } from '../../types/customizeProductsFooterTypes';

const CustomizeProductsFooter = () => {
    // const footerResizeActive = useAppSelector((state) => state.customizeProductsFooter.footerResizeActive)
    const resizeStartLocation = useAppSelector((state) => state.customizeProductsFooter.resizeStartLocation)
    const resizeEndLocation = useAppSelector((state) => state.customizeProductsFooter.resizeEndLocation)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const footerRef = useRef<HTMLHeadingElement>(null);
    const [footerHeight, setFooterHeight] = useState('auto')
    const dispatch = useAppDispatch()

    // const handleResizeClickDown = (event: any) => {
    //     dispatch(setResizeStartLocation({left: event.pageX, top: event.pageY}))
    //     dispatch(setResizeActive())
    // }

    // const calculateFooterHeightAfterResize = (mouseDownLocation: mouseLocation, mouseUpLocation: mouseLocation, currentFooterHeight: number): number => {
    //     const heightDifference = mouseUpLocation.top - mouseDownLocation.top
    //     return currentFooterHeight - heightDifference
    // }

    // useEffect(() => {
    //     const footerHeightNumber = footerRef.current?.clientHeight ? calculateFooterHeightAfterResize(resizeStartLocation, resizeEndLocation, footerRef.current?.clientHeight) : footerHeight
    //     setFooterHeight(`${footerHeightNumber}px`)
    // }, [resizeEndLocation])

  return (
    <div className={`Customize-products-container-all Customize-products-container fixed-bottom ${colorModeClass}-background`} ref={footerRef} style={{height: 'auto'}}>
        {/* <Row>
            <Col md={{ span: 2, offset: 5 }}>
                <ArrowsExpand className="Footer-resize" style={{cursor: footerResizeActive ? 'grabbing' : 'grab'}} color="white" size={24} onMouseDown={(event) => handleResizeClickDown(event)}/>
            </Col>
        </Row> */}
        <Row>
            <Col md={{span: 6, offset: 3}}>
                <h2 className={`${colorModeClass}-text`}>Customized Products</h2>
            </Col>
            <Col md={{ span: 1, offset: 2 }}>
                <ChevronDown className={`${colorModeClass}-text`} style={{cursor: 'pointer'}} size={36} onClick={() => dispatch(setFooterMinimized())}/>
            </Col>
        </Row>
        <Row>
            <CustomizedProductTable />
        </Row>
        <Row>
            <Col>
                <Button variant="success" onClick={() => dispatch(setShowAddProductModalTrue())}>
                    <Plus size={24}/> Add Custom Product
                </Button>
            </Col>
            {/* <Col>
                <Button variant="success">Create Selected Rasters</Button>
            </Col> */}
        </Row>
        <AddProductModal/>
    </div>
  );
}

export default CustomizeProductsFooter;