import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowGenerateProductModalFalse } from './actions/modalSlice'
import { addGeneratedProducts, addGranuleTableAlerts } from './actions/productSlice'
import { Row } from 'react-bootstrap';
import { granuleAlertMessageConstant } from '../../constants/rasterParameterConstants';
import { alertMessageInput } from '../../types/constantTypes';

const GenerateProductsModal = () => {
    const showGenerateProductModal = useAppSelector((state) => state.modal.showGenerateProductModal)
    const addedGranules = useAppSelector((state) => state.product.addedProducts)
    const dispatch = useAppDispatch()

    const setSaveGranulesAlert = (alert: alertMessageInput, additionalParameters?: any[]) => {
        const {message, variant} = granuleAlertMessageConstant[alert]
        dispatch(addGranuleTableAlerts({type: alert, message, variant, tableType: 'productCustomization' }))
      }

    const handleGenerate = () => {
        // unselect select-all box
        dispatch(addGeneratedProducts({granuleIds: addedGranules.map(granuleObj => granuleObj.granuleId), typeOfGenerate: 'generate'}))
        dispatch(setShowGenerateProductModalFalse())
        setSaveGranulesAlert('successfullyGenerated')
    }

  return (
    <Modal show={showGenerateProductModal} onHide={() => dispatch(setShowGenerateProductModalFalse())} id='generate-products-modal'>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Generate Products</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
            <h5>Are you sure you would like to generate products with the following granules:</h5>
            <h6>{addedGranules.map((granuleObj, index) => index === addedGranules.length-1 ? `${granuleObj.granuleId} ` : `${granuleObj.granuleId}, `)}</h6>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowGenerateProductModalFalse())}>Close</Button>
        <Button variant="success" type="submit" onClick={() => handleGenerate()}>Generate</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default GenerateProductsModal;