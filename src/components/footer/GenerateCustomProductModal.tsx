import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowGenerateProductModalFalse } from './customProductModalSlice'
import { Row } from 'react-bootstrap';
import { GenerateProductModalProps } from '../../types/modalTypes';

const GenerateProductModal = (props: GenerateProductModalProps) => {
    const showGenerateProductModal = useAppSelector((state) => state.customProductModal.showGenerateProductModal)
    const dispatch = useAppDispatch()
    // const {productsBeingGenerated} = props

    useEffect(() => {console.log(showGenerateProductModal)}, [showGenerateProductModal])


    const handleDelete = () => {
        console.log('in delete function')
        // dispatch(addProduct(parameters))
        dispatch(setShowGenerateProductModalFalse())
    }

  return (
    <Modal show={showGenerateProductModal} onHide={() => dispatch(setShowGenerateProductModalFalse())}>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Generate Product</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
                <h5>{`Are you sure you would like to generate BLANK?`}</h5>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowGenerateProductModalFalse())}>Close</Button>
        <Button variant="success" type="submit" onClick={() => handleDelete()}>Generate</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default GenerateProductModal;