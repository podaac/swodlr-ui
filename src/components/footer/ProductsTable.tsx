import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { granuleEssentialLabels } from '../../constants/rasterParameterConstants';
import { Button, Form } from 'react-bootstrap';
import { PencilSquare, PlayFill, Trash } from 'react-bootstrap-icons';
import EditCusomProductModal from './EditCustomProductModal'
import DeleteCusomProductModal from './DeleteCustomProductModal'
import GenerateCusomProductModal from './GenerateCustomProductModal'
import { setShowDeleteProductModalTrue, setShowEditProductModalTrue, setShowGenerateProductModalTrue } from './customProductModalSlice';
import { arrayOfProductIds } from '../../types/modalTypes';
import { allProductParameters } from '../../types/constantTypes';


const CustomizedProductTable = () => {
  const allProductParametersArray = useAppSelector((state) => state.customProductModal.allProductParametersArray)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const dispatch = useAppDispatch()
  const [productsBeingEdited, setProductBeingEdited] = useState([] as arrayOfProductIds)
  const [productsBeingDeleted, setProductBeingDeleted] = useState([] as arrayOfProductIds)
  const [productsBeingGenerated, setProductBeingGenerated] = useState([] as arrayOfProductIds)

  const handleEdit = (granuleId: string) => {
    setProductBeingEdited([...productsBeingEdited, granuleId])
    dispatch(setShowEditProductModalTrue())
  }
  
  const handleDelete = (granuleId: string) => {
    const granuleIdToDelete: string = granuleId.split('-')[0]
    dispatch(setShowDeleteProductModalTrue())
    setProductBeingDeleted([...productsBeingDeleted, granuleIdToDelete])
  }
  
  const handleGenerate = (granuleId: string) => {
    setProductBeingGenerated([...productsBeingGenerated, granuleId])
    dispatch(setShowGenerateProductModalTrue())
  }

  return (
    <div className='table-responsive'>
      <Table bordered hover className={`table-responsive Products-table ${colorModeClass}-table`}>
        <thead>
          <tr>
            <th>          
              <Form.Check
                inline
                name="group1"
                id={`inline-select-all`}
                style={{cursor: 'pointer'}}
              />
            </th>
            {Object.entries(granuleEssentialLabels).map(labelEntry => <th>{labelEntry[1]}</th>)}
            <th>Edit</th>
            <th>Delete</th>
            {/* <th>Generate</th> */}
          </tr>
        </thead>
        <tbody>
          {allProductParametersArray.map((productParameterObject, index) => {
            // remove footprint from product object when mapping to table
            const {name, cycle, pass, scene, granuleId} = productParameterObject
            const essentialsGranule = {cycle, pass, scene, granuleId}
            return (
            <tr className={`${colorModeClass}-table`}>
              <td>
                <Form.Check
                  inline
                  name="group1"
                  id={`inline-select-${index}`}
                  className='table-checkbox'
                />
              </td>
              {Object.entries(essentialsGranule).map(entry => {
                let valueToDisplay = entry[1]
                if (entry[0] === 'outputSamplingGridType' && typeof valueToDisplay === 'string') {
                  valueToDisplay = valueToDisplay.toUpperCase()
                }
                return <td>{valueToDisplay}</td>
              })}
              <td>
                <Button variant="primary" id={`${essentialsGranule.granuleId}-edit`} size='sm' onClick={(event) => handleEdit(event.currentTarget.id)}>
                  <PencilSquare color="white" size={18}/>
                </Button>
              </td>
              <td>
                <Button variant="danger" id={`${essentialsGranule.granuleId}-delete`} size='sm' onClick={(event) => handleDelete(event.currentTarget.id)}>
                  <Trash color="white" size={18}/>
                </Button>
              </td>
              {/* <td>
                <Button variant="success" id={`${essentialsGranule.granuleId}-generate`} size='sm' onClick={(event) => handleGenerate(event.currentTarget.id)}>
                  <PlayFill color="white" size={18}/>
                </Button>
              </td> */}
            </tr>
          )})}
        </tbody>
      </Table>
      <EditCusomProductModal productsBeingEdited={productsBeingEdited}/>
      <DeleteCusomProductModal productsBeingDeleted={productsBeingDeleted}/>
      <GenerateCusomProductModal productsBeingGenerated={productsBeingGenerated}/>
    </div>
  );
}

export default CustomizedProductTable;