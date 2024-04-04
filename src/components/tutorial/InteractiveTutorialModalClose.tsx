import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowCloseTutorialFalse, setSkipTutorialTrue } from '../sidebar/actions/modalSlice'
import { Row } from 'react-bootstrap';
import { setStartTutorial } from '../app/appSlice';
import { deleteProduct } from '../sidebar/actions/productSlice';
import { useNavigate } from 'react-router-dom';

const InteractiveTutorialModalClose = () => {
    const showCloseTutorialModal = useAppSelector((state) => state.modal.showCloseTutorialModal)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const addedProducts = useAppSelector((state) => state.product.addedProducts)

    const handleCloseTutorial = () => {
        dispatch(setSkipTutorialTrue())
        dispatch(setStartTutorial(false))
        dispatch(deleteProduct(addedProducts.map(product => product.granuleId)))
        navigate(`/customizeProduct/selectScenes`)
        dispatch(setShowCloseTutorialFalse())
    }

  return (
    <Modal style={{zIndex: 2000}} show={showCloseTutorialModal} onHide={() => dispatch(setShowCloseTutorialFalse())}>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Exit Interactive Tutorial</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
            <h5>Are you sure you want to exit the tutorial?</h5>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowCloseTutorialFalse())}>Back to Tutorial</Button>
        <Button variant="danger" type="submit" onClick={() => handleCloseTutorial()}>Exit</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default InteractiveTutorialModalClose;