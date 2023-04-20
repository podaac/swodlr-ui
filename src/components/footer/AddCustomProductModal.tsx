import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AddProductModalProps } from '../../types/ModalTypes';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setFalse } from './addCustomProductModalSlice'

const AddProductModal = () => {
    const showAddProductModal = useAppSelector((state) => state.addCustomProductModal.showAddProductModal)
    const dispatch = useAppDispatch()

  return (
    <Modal show={showAddProductModal} onHide={() => dispatch(setFalse())}>
    <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
    </Modal.Header>

    <Modal.Body>
        <p>Modal body text goes here.</p>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setFalse())}>Close</Button>
        <Button variant="primary">Save</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default AddProductModal;