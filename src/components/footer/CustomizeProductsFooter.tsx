import { Button, Col, Row} from 'react-bootstrap';
import { ChevronDown, Plus } from 'react-bootstrap-icons';
import CustomizedProductTable from './ProductsTable';
import AddProductModal from './AddCustomProductModal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setTrue } from './addCustomProductModalSlice'

const CustomizeProductsFooter = () => {
    const showAddProductModal = useAppSelector((state) => state.addCustomProductModal.showAddProductModal)
    const dispatch = useAppDispatch()

  return (
    <div className='Customize-products-container fixed-bottom'>
        <Row>
            <Col md={{span: 6, offset: 3}}>
                <h2 style={{color: 'white'}}>Customized Products</h2>
            </Col>
            <Col md={{ span: 1, offset: 2 }}>
                <ChevronDown color="white" size={36}/>
            </Col>
        </Row>
        <Row>
            <CustomizedProductTable />
        </Row>
        <Row>
            <Col>
                <Button variant="primary" onClick={() => dispatch(setTrue())}>
                    <Plus color="white" size={24}/> Add Custom Product
                </Button>
            </Col>
            <Col>
                <Button variant="primary" disabled={true}>Create Selected Rasters</Button>
            </Col>
        </Row>
        <AddProductModal/>
    </div>
  );
}

export default CustomizeProductsFooter;