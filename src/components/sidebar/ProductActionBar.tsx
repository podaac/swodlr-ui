import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowDeleteProductModalTrue, setShowGenerateProductModalTrue } from './actions/modalSlice'
import { deleteProduct, setSelectedGranules } from './actions/productSlice'
import { Col, Row } from 'react-bootstrap';
import GenerateProductsModal from './GenerateProductsModal';
import { Trash } from 'react-bootstrap-icons';

const ProductActionBar = () => {
    const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const dispatch = useAppDispatch()

    const handleDeleteSelectedGranules = () => {
        dispatch(setShowDeleteProductModalTrue())

        dispatch(setSelectedGranules([]))
        // unselect select-all box
    }

  return (
    <>
        <Row className='heading-row'>
            <h4 className={`${colorModeClass}-text`}>Bulk Actions</h4>
        </Row>
        <Row>
            <Col>
                <Button disabled={selectedGranules.length === 0} variant='danger' onClick={() =>  dispatch(setShowDeleteProductModalTrue())}>
                    <Trash color="white" size={18}/> Delete Selected
                </Button></Col>
            <Col>
                <Button disabled={selectedGranules.length === 0} variant="success" onClick={() => dispatch(setShowGenerateProductModalTrue())}>
                    Generate Selcted
                </Button>
            </Col>
            <GenerateProductsModal />
        </Row>   
    </>  
  );
}

export default ProductActionBar;