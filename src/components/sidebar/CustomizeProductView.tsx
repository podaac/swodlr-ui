import GranuleTable from './GranulesTable';
import ProductCustomization from './ProductCustomization';
import GenerateProducts from './GenerateProducts';

const GranuleSelectionView = () => {
  return (
    <>
      <ProductCustomization />
      <GranuleTable tableType='productCustomization'/>
      <hr></hr>
      <GenerateProducts />
    </>
  );
}

export default GranuleSelectionView;