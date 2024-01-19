import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowTutorialModalFalse } from '../sidebar/actions/modalSlice'
import { Row } from 'react-bootstrap';
import { setStartTutorial } from '../app/appSlice';

const InteractiveTutorialModal = () => {
    const showTutorialModal = useAppSelector((state) => state.modal.showTutorialModal)
    const dispatch = useAppDispatch()

    const handleStartTutorial = () => {
        dispatch(setShowTutorialModalFalse())
        dispatch(setStartTutorial(true))
    }

  return (
    <Modal show={showTutorialModal} onHide={() => dispatch(setShowTutorialModalFalse())}>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Interactive Tutorial</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
            <h5>Would you like a quick run through on how to operate this website?</h5>
            <h5>If not, you can always start the tutorial at any time by clicking <b>Tutorial</b> button in the navbar.</h5>
        </Row>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowTutorialModalFalse())}>Skip</Button>
        <Button variant="primary" type="submit" onClick={() => handleStartTutorial()}>Start</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default InteractiveTutorialModal;