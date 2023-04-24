import { Col, Row} from 'react-bootstrap';
import { ChevronUp } from 'react-bootstrap-icons';
import { useAppDispatch } from '../../redux/hooks'
import { setFooterExpanded } from './customizeProductsFooterSlice';

const CustomizeProductsFooter = () => {
    const dispatch = useAppDispatch()
    // const footerResizeActive = useAppSelector((state) => state.customizeProductsFooter.footerResizeActive)

  return (
    <div className='Customize-products-container-min fixed-bottom'>
        <Row>
            <Col md={{span: 4}}>
                <h2 style={{color: 'white'}}>Customized Products</h2>
            </Col>
            <Col md={{ span: 1, offset: 7 }}>
                <ChevronUp style={{cursor: 'pointer'}} color="white" size={36} onClick={() => dispatch(setFooterExpanded())}/>
            </Col>
        </Row>
    </div>
  );
}

export default CustomizeProductsFooter;