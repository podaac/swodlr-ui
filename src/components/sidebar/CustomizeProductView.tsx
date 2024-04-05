import GranuleTable from './GranulesTable';
import ProductCustomization from './ProductCustomization';
import GenerateProducts from './GenerateProducts';
import GranuleTableAlerts from './GranuleTableAlerts';

const GranuleSelectionView = () => {
  return (
    <>
      <ProductCustomization />
      <GranuleTable tableType='productCustomization'/>
      <hr></hr>
      <GenerateProducts />
      <GranuleTableAlerts tableType='productCustomization'/>

    </>
  );
}

export default GranuleSelectionView;