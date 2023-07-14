import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { Breadcrumb, Button, Col, Row } from 'react-bootstrap';
import { TabTypes } from '../../types/constantTypes';
import { setActiveTab } from './actions/sidebarSlice';
import { ChevronDoubleRight } from 'react-bootstrap-icons';

const SidebarBreadcrumbs = () => {
  const activeTab = useAppSelector((state) => state.sidebar.activeTab)
  const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
  const dispatch = useAppDispatch()

  const getTabClass = (tabId: TabTypes) => {
    console.log()
    return tabId === activeTab ? `${colorModeClass}-active-tab` : `${colorModeClass}-inactive-tab` 
}
  return (
    <div>
      {/* <Col>
      <Button id="granuleSelection" className={`product-tab ${getTabClass('granuleSelection')}`} style={{height: '50px', width: '230px', marginTop: '10px'}} onClick={() => dispatch(setActiveTab('granuleSelection'))}>1. Select Scenes</Button>
      </Col>
      <Col><ChevronDoubleRight size={42} /></Col>
      <Col>
      <Button id="productCustomization" className={`product-tab ${getTabClass('productCustomization')}`} style={{height: '50px', width: '230px', marginTop: '10px'}} onClick={() => dispatch(setActiveTab('productCustomization'))}>2. Configure Options</Button>
      </Col> */}
      <Breadcrumb style={{backgroundColor: '#1A2535', padding: '5px'}}>
        <Breadcrumb.Item onClick={() => dispatch(setActiveTab('granuleSelection'))}>
          <h5 style={{color: ''}}>Select Scenes</h5>
        </Breadcrumb.Item>
        <Breadcrumb.Item active={activeTab === 'productCustomization'} onClick={() => dispatch(setActiveTab('productCustomization'))}>
          <h5 style={{color: ''}}>Configure Options</h5>
        </Breadcrumb.Item>
      </Breadcrumb>
      <hr className={`${colorModeClass}-text`} style={{marginTop: '0px', backgroundColor: 'black', borderWidth: '0px', opacity: 1}} />
    </div>
  );
}

export default SidebarBreadcrumbs;