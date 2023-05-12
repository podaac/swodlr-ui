import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowDeleteProductModalFalse } from './actions/modalSlice'
import { Row } from 'react-bootstrap';
import { deleteProduct, setSelectedGranules } from './actions/productSlice';

const GenerateProductsModal = () => {
    const showDeleteProductModal = useAppSelector((state) => state.modal.showDeleteProductModal)
    // const addedProducts = useAppSelector((state) => state.product.addedProducts)
    const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
    const dispatch = useAppDispatch()
    // const productNames = addedProducts.filter(productObject => productsBeingDeleted.includes(productObject.granuleId)).map(object => object.name ?? object.granuleId)


    const handleDelete = () => {
        dispatch(deleteProduct(selectedGranules))
        dispatch(setSelectedGranules([]))
        // unselect select-all box
        dispatch(setShowDeleteProductModalFalse())
    }

  return (
    <Modal show={showDeleteProductModal} onHide={() => dispatch(setShowDeleteProductModalFalse())}>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Delete Granules</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
            <h5>Are you sure you would like to delete granules:</h5>
            <h6>{selectedGranules.map((granuleId, index) => index === selectedGranules.length-1 ? `${granuleId} ` : `${granuleId}, `)}</h6>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowDeleteProductModalFalse())}>Close</Button>
        <Button variant="danger" type="submit" onClick={() => handleDelete()}>Delete</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default GenerateProductsModal;