import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowDeleteProductModalFalse } from './customProductModalSlice'
import { Row } from 'react-bootstrap';
import { DeleteProductModalProps } from '../../types/modalTypes';

const DeleteProductModal = (props: DeleteProductModalProps) => {
    const showDeleteProductModal = useAppSelector((state) => state.customProductModal.showDeleteProductModal)
    const allProductParametersArray = useAppSelector((state) => state.customProductModal.allProductParametersArray)
    const dispatch = useAppDispatch()
    const {productsBeingDeleted} = props
    const productNames = allProductParametersArray.filter(productObject => productsBeingDeleted.includes(productObject.productId)).map(object => object.name)
    console.log(productsBeingDeleted)
    useEffect(() => {console.log(showDeleteProductModal)}, [showDeleteProductModal, productsBeingDeleted])


    const handleDelete = () => {
        console.log('in delete function')
        // dispatch(addProduct(parameters))
        dispatch(setShowDeleteProductModalFalse())
    }

  return (
    <Modal show={showDeleteProductModal} onHide={() => dispatch(setShowDeleteProductModalFalse())}>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Delete Product</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>

                <h5>{`Are you sure you would like to delete products: ${productNames}?`}</h5>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowDeleteProductModalFalse())}>Close</Button>
        <Button variant="danger" type="submit" onClick={() => handleDelete()}>Delete</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default DeleteProductModal;