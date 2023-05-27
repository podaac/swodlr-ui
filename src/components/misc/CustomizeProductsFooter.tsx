import { useRef } from 'react';
import { Button, Col, Row} from 'react-bootstrap';
import { ChevronDown, Plus } from 'react-bootstrap-icons';
import CustomizedProductTable from '../sidebar/GranulesTable';
import AddProductModal from './AddCustomProductModal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowAddProductModalTrue } from '../sidebar/actions/modalSlice'
import { setFooterMinimized } from '../sidebar/actions/sidebarSlice';

const CustomizeProductsFooter = () => {
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const footerRef = useRef<HTMLHeadingElement>(null);
    const dispatch = useAppDispatch()

  return (
    <div className={`Customize-products-container-all Customize-products-container fixed-bottom ${colorModeClass}-background`} ref={footerRef} style={{height: 'auto'}}>
        <Row>
            <Col md={{span: 6, offset: 3}}>
                <h2 className={`${colorModeClass}-text`}>Customized Products</h2>
            </Col>
            <Col md={{ span: 1, offset: 2 }}>
                <ChevronDown className={`${colorModeClass}-text`} style={{cursor: 'pointer'}} size={36} onClick={() => dispatch(setFooterMinimized())}/>
            </Col>
        </Row>
        <Row>
            <CustomizedProductTable tableType='granuleSelection'/>
        </Row>
        <Row>
            <Col>
                <Button variant="success" onClick={() => dispatch(setShowAddProductModalTrue())}>
                    <Plus size={24}/> Add Custom Product
                </Button>
            </Col>

        </Row>
        <AddProductModal/>
    </div>
  );
}

export default CustomizeProductsFooter;