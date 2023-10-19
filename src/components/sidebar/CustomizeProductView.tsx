import GranuleTable from './GranulesTable';
import ProductCustomization from './ProductCustomization';
import GenerateProducts from './GenerateProducts';
import Alerts from './Alerts';

const GranuleSelectionView = () => {
  return (
    <>
      <ProductCustomization />
      <GranuleTable tableType='productCustomization'/>
      <hr></hr>
      <GenerateProducts />
      <Alerts location='generate' />
    </>
  );
}

export default GranuleSelectionView;
