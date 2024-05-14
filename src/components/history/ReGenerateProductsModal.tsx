import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { Row } from 'react-bootstrap';
import { granuleAlertMessageConstant } from '../../constants/rasterParameterConstants';
import { alertMessageInput } from '../../types/constantTypes';
import { setShowReGenerateProductModalFalse } from '../sidebar/actions/modalSlice';
import { addGeneratedProducts, addGranuleTableAlerts } from '../sidebar/actions/productSlice';

const ReGenerateProductsModal = () => {
    const showReGenerateProductModal = useAppSelector((state) => state.modal.showReGenerateProductModal)
    const granulesToReGenerate = useAppSelector((state) => state.product.granulesToReGenerate)
    const dispatch = useAppDispatch()

    const setSaveGranulesAlert = (alert: alertMessageInput, additionalParameters?: any[]) => {
        const {message, variant} = granuleAlertMessageConstant[alert]
        dispatch(addGranuleTableAlerts({type: alert, message, variant, tableType: 'productCustomization' }))
      }

    const handleGenerate = () => {
        // unselect select-all box
        console.log(granulesToReGenerate.map(granule => granule.id))
        dispatch(addGeneratedProducts(granulesToReGenerate.map(granule => granule.id)))
        dispatch(setShowReGenerateProductModalFalse())
        setSaveGranulesAlert('successfullyReGenerated')
    }

  return (
    <Modal show={showReGenerateProductModal} onHide={() => dispatch(setShowReGenerateProductModalFalse())} id='generate-products-modal'>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Re-Generate Product</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
            <h5>Are you sure you would like to generate products with the following granules:</h5>
            <h6>{granulesToReGenerate.map((granuleObject, index) => index === granulesToReGenerate.length-1 ? `${granuleObject.cycle}_${granuleObject.pass}_${granuleObject.scene} ` : `${granuleObject.cycle}_${granuleObject.pass}_${granuleObject.scene}, `)}</h6>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowReGenerateProductModalFalse())}>Close</Button>
        <Button variant="Warning" type="submit" onClick={() => handleGenerate()}>Generate</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default ReGenerateProductsModal;