import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowGenerateProductModalFalse } from './actions/modalSlice'
import { addGeneratedProducts } from './actions/productSlice'
import { Row } from 'react-bootstrap';
import { setActiveTab } from './actions/sidebarSlice';

const GenerateProductsModal = () => {
    const showGenerateProductModal = useAppSelector((state) => state.modal.showGenerateProductModal)
    const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
    const generateProductParameters = useAppSelector((state) => state.product.generateProductParameters)
    const dispatch = useAppDispatch()

    const handleGenerate = () => {
        // unselect select-all box
        console.log(generateProductParameters)
        dispatch(addGeneratedProducts(selectedGranules))
        dispatch(setActiveTab('productHistory'))
        dispatch(setShowGenerateProductModalFalse())
    }

  return (
    <Modal show={showGenerateProductModal} onHide={() => dispatch(setShowGenerateProductModalFalse())}>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Generate Products</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
            <h5>Are you sure you would like to generate products with the following granules:</h5>
            <h6>{selectedGranules.map((granuleId, index) => index === selectedGranules.length-1 ? `${granuleId} ` : `${granuleId}, `)}</h6>
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