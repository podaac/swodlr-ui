import Table from 'react-bootstrap/Table';
import { useAppSelector } from '../../redux/hooks'
import { parameterOptionLabels } from '../../constants/rasterParameterConstants';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';


const CustomizedProductTable = () => {
  const allProductParametersArray = useAppSelector((state) => state.addCustomProductModal.allProductParametersArray)

  return (
    <Table bordered hover style={{color:'white'}}>
      <thead>
        <tr>
          <th>          
            <Form.Check
              inline
              name="group1"
              id={`inline-select-all`}
            />
          </th>
          {Object.entries(parameterOptionLabels).map(labelEntry => <th>{labelEntry[1]}</th>)}
          <th>Actions</th>
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
              />
            </td>
            {Object.entries(productParameterObject).map(entry => <td>{entry[1]}</td>)}
            <td>
              <Row>
                <Col>
                  <Button variant="success" size='sm'>
                    <PencilSquare color="white" size={18}/>
                  </Button>
                </Col>
                <Col>
                  <Button variant="danger" size='sm'>
                    <Trash color="white" size={18}/>
                  </Button>
                </Col>
              </Row>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default CustomizedProductTable;