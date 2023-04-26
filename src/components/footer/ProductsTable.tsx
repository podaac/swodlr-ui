import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { parameterOptionLabels } from '../../constants/rasterParameterConstants';
import { Button, Form } from 'react-bootstrap';
import { PencilSquare, PlayFill, Trash } from 'react-bootstrap-icons';
import EditCusomProductModal from './EditCustomProductModal'
import DeleteCusomProductModal from './DeleteCustomProductModal'
import GenerateCusomProductModal from './GenerateCustomProductModal'
import { setShowDeleteProductModalTrue, setShowEditProductModalTrue, setShowGenerateProductModalTrue } from './customProductModalSlice';
import { arrayOfProductIds } from '../../types/modalTypes';


const CustomizedProductTable = () => {
  const allProductParametersArray = useAppSelector((state) => state.customProductModal.allProductParametersArray)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const dispatch = useAppDispatch()
  const [productsBeingEdited, setProductBeingEdited] = useState([] as arrayOfProductIds)
  const [productsBeingDeleted, setProductBeingDeleted] = useState([] as arrayOfProductIds)
  const [productsBeingGenerated, setProductBeingGenerated] = useState([] as arrayOfProductIds)

  const handleEdit = (productId: string) => {
    setProductBeingEdited([...productsBeingEdited, productId])
    dispatch(setShowEditProductModalTrue())
  }
  
  const handleDelete = (productId: string) => {
    dispatch(setShowDeleteProductModalTrue())
    setProductBeingDeleted([...productsBeingDeleted, productId])
  }
  
  const handleGenerate = (productId: string) => {
    setProductBeingGenerated([...productsBeingGenerated, productId])
    dispatch(setShowGenerateProductModalTrue())
  }

  return (
    <div className='table-responsive'>
      <Table bordered hover className={`table-responsive Products-table ${colorModeClass}-text`}>
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
            {Object.entries(parameterOptionLabels).map(labelEntry => <th>{labelEntry[1]}</th>)}
            <th>Edit</th>
            <th>Delete</th>
            <th>Generate</th>
          </tr>
        </thead>
        <tbody>
          {allProductParametersArray.map((productParameterObject, index) => (
            <tr>
              <td>
                <Form.Check
                  inline
                  name="group1"
                  id={`inline-select-${index}`}
                  className='table-checkbox'
                />
              </td>
              {Object.entries(productParameterObject).map(entry => {
                let valueToDisplay = entry[1]
                if (entry[0] === 'outputSamplingGridType') {
                  valueToDisplay = valueToDisplay.toUpperCase()
                }
                return <td>{valueToDisplay}</td>
              })}
              <td>
                <Button variant="primary" id={`${productParameterObject.productId}-edit`} size='sm' onClick={(event) => handleEdit(event.currentTarget.id)}>
                  <PencilSquare color="white" size={18}/>
                </Button>
              </td>
              <td>
                <Button variant="danger" id={`${productParameterObject.productId}-delete`} size='sm' onClick={(event) => handleDelete(event.currentTarget.id)}>
                  <Trash color="white" size={18}/>
                </Button>
              </td>
              <td>
                <Button variant="success" id={`${productParameterObject.productId}-generate`} size='sm' onClick={(event) => handleGenerate(event.currentTarget.id)}>
                  <PlayFill color="white" size={18}/>
                </Button>
              </td>
              {/* <td>
                <Row>
                  <Col>
                    <Button variant="primary" size='sm'>
                      <PencilSquare color="white" size={18}/>
                    </Button>
                  </Col>
                  <Col>
                    <Button variant="danger" size='sm'>
                      <Trash color="white" size={18}/>
                    </Button>
                  </Col>
                  <Col>
                    <Button variant="success" size='sm'>
                      <Play color="white" size={18}/>
                    </Button>
                  </Col>
                </Row>
              </td> */}
            </tr>
          ))}
        </tbody>
      </Table>
      <EditCusomProductModal productsBeingEdited={productsBeingEdited}/>
      <DeleteCusomProductModal productsBeingDeleted={productsBeingDeleted}/>
      <GenerateCusomProductModal productsBeingGenerated={productsBeingGenerated}/>
    </div>
  );
}

export default CustomizedProductTable;