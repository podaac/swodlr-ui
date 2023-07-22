import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowGenerateProductModalTrue } from './actions/modalSlice'
import { Button, Col, Row } from 'react-bootstrap';
import { ArrowReturnRight } from 'react-bootstrap-icons';
import GenerateProductsModal from './GenerateProductsModal';

const GenerateProducts = () => {
    const showGenerateProductsModal = useAppSelector((state) => state.modal.showGenerateProductModal)
    const addedGranules = useAppSelector((state) => state.product.addedProducts)

    const dispatch = useAppDispatch()

    useEffect(() => {}, [showGenerateProductsModal])

    const handleGenerateProducts = () => {
        dispatch(setShowGenerateProductModalTrue())
    }

  return (
    <Row style={{marginBottom: '10px', marginRight: '10px', marginLeft: '10px'}}>
        <Col>
            <Button variant='success' disabled={addedGranules.length === 0}  onClick={() => handleGenerateProducts()}>Generate Products <ArrowReturnRight /></Button>
        </Col>
        <GenerateProductsModal />
    </Row>
  );
}

export default GenerateProducts;