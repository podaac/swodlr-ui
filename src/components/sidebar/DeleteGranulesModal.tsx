import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setShowDeleteProductModalFalse } from './actions/modalSlice'
import { Row } from 'react-bootstrap';
import { deleteProduct, setSelectedGranules } from './actions/productSlice';
import { useSearchParams } from 'react-router-dom';

const GenerateProductsModal = () => {
    const showDeleteProductModal = useAppSelector((state) => state.modal.showDeleteProductModal)
    const selectedGranules = useAppSelector((state) => state.product.selectedGranules)
    const dispatch = useAppDispatch()
    const [searchParams, setSearchParams] = useSearchParams()

    const removeCPSFromUrl = (cpsCombosToRemove: string[]) => {
        const cyclePassSceneParameters = searchParams.get('cyclePassScene')?.split('-')
        if (cyclePassSceneParameters) {
            const cyclePassSceneParametersToKeep = cyclePassSceneParameters.filter(cpsCombo => {
                const urlCPSSplit = cpsCombo.split('_')
                const reconstructedUrlCPS = `${urlCPSSplit[0]}_${urlCPSSplit[1]}_${urlCPSSplit[2]}`
                const keepCPSCombo = !cpsCombosToRemove.includes(reconstructedUrlCPS)
                return keepCPSCombo
            }).join('-')
            const currentUrlParameters = Object.fromEntries(searchParams.entries())
            if (cyclePassSceneParametersToKeep.length === 0) {
                const {cyclePassScene, ...restOfCurrentUrlParameters} = currentUrlParameters
                setSearchParams(restOfCurrentUrlParameters)
            } else {
                setSearchParams({...currentUrlParameters, cyclePassScene: cyclePassSceneParametersToKeep})
            }
        }
    }

    const handleDelete = () => {
        dispatch(deleteProduct(selectedGranules))
        // remove url parameters of selectedGranules
        removeCPSFromUrl(selectedGranules)
        // addSearchParamToCurrentUrlState
        dispatch(setSelectedGranules([]))
        // unselect select-all box
        dispatch(setShowDeleteProductModalFalse())
    }

  return (
    <Modal show={showDeleteProductModal} onHide={() => dispatch(setShowDeleteProductModalFalse())}>
    <Modal.Header className="modal-style" closeButton>
        <Modal.Title>Remove Selected Granules</Modal.Title>
    </Modal.Header>

    <Modal.Body className="modal-style">
        <Row>
            <h5>Are you sure you would like to remove selected granules:</h5>
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