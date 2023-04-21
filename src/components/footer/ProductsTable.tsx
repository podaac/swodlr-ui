import Table from 'react-bootstrap/Table';
import { allProductParameters } from '../../types/constantTypes';

const addedTableRow = (addedProductParameters: allProductParameters) => {
    return (
    <tr>
        {Object.entries(addedProductParameters).map(entry => <td>{entry[1]}</td>)}
    </tr>
    )
}

const CustomizedProductTable = () => {
  return (
    <Table striped bordered hover style={{color:'white'}}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Cycle ID</th>
          <th>Pass ID</th>
          <th>Scene ID</th>
          <th>Output Granule Extent Flag</th>
          <th>Output Sampling Grid Type</th>
          <th>Raster Resolution</th>
          <th>UTM Zone Adjust</th>
          <th>MGRS Band Adjust</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr> */}
      </tbody>
    </Table>
  );
}

export default CustomizedProductTable;