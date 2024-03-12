import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { Button, Row } from 'react-bootstrap';
import { TabTypes } from '../../types/constantTypes';
import { setActiveTab } from './actions/sidebarSlice';

const SidebarTabs = () => {
  const activeTab = useAppSelector((state) => state.sidebar.activeTab)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const dispatch = useAppDispatch()

  const getTabClass = (tabId: TabTypes) => {
    return tabId === activeTab ? `${colorModeClass}-active-tab` : `${colorModeClass}-inactive-tab` 
}
  return (
    <Row>
      <Button id="granuleSelection" className={`product-tab ${getTabClass('granuleSelection')}`} style={{height: '50px', width: '230px', marginTop: '10px'}} onClick={() => dispatch(setActiveTab('granuleSelection'))}>1. Select Scenes</Button>
      <Button id="productCustomization" className={`product-tab ${getTabClass('productCustomization')}`} style={{height: '50px', width: '230px', marginTop: '10px'}} onClick={() => dispatch(setActiveTab('productCustomization'))}>2. Configure Options</Button>
      <hr className={`${colorModeClass}-text`} style={{marginTop: '0px', backgroundColor: 'black', borderWidth: '1px', opacity: 1}} />
    </Row>
  );
}

export default SidebarTabs;