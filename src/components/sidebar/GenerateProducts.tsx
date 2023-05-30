import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowGenerateProductModalTrue } from './actions/modalSlice'
import { Button, Col, Row } from 'react-bootstrap';
import { ArrowReturnRight } from 'react-bootstrap-icons';
import GenerateProductsModal from './GenerateProductsModal';
import { setGenerateProductParameters } from './actions/productSlice';
import { GenerateProductParameters } from '../../types/constantTypes';

const GenerateProducts = () => {
    const showGenerateProductsModal = useAppSelector((state) => state.modal.showGenerateProductModal)
    const addedGranules = useAppSelector((state) => state.product.addedProducts)
    const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
    const granuleTableEditable = useAppSelector((state) => state.sidebar.granuleTableEditable)

    const dispatch = useAppDispatch()

    const productCustomizationNotAllowed = addedGranules.length === 0 || granuleTableEditable

    const { outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, utmZoneAdjust, mgrsBandAdjust } = generateProductParameters

    useEffect(() => {}, [showGenerateProductsModal])

    const handleGenerateProducts = () => {
        const selectedProductParameters: GenerateProductParameters = {
            outputGranuleExtentFlag,
            outputSamplingGridType,
            rasterResolution,
            utmZoneAdjust,
            mgrsBandAdjust
        }
        dispatch(setGenerateProductParameters(selectedProductParameters))
        dispatch(setShowGenerateProductModalTrue())
    }

  return (
    <Row style={{marginBottom: '10px'}}>
        <Col>
            <Button variant='success' disabled={productCustomizationNotAllowed}  onClick={() => handleGenerateProducts()}>Generate Products <ArrowReturnRight /></Button>
        </Col>
        <GenerateProductsModal />
    </Row>
  );
}

export default GenerateProducts;