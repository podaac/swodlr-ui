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
    <div style={{marginTop: '10px'}}>
      {/* <hr className={`${colorModeClass}-text`} style={{marginTop: '0px', backgroundColor: 'black', borderWidth: '0px', opacity: 1}} /> */}
      <Breadcrumb style={{color: 'black'}}>
        <Breadcrumb.Item className='sidebar-breadcrumb-item' href="#" style={{fontSize: '24px'}} onClick={() => dispatch(setActiveTab('granuleSelection'))}>
          Select Scenes
        </Breadcrumb.Item>
        <Breadcrumb.Item className='sidebar-breadcrumb-item' href="#" active={activeTab === 'productCustomization'} style={{fontSize: '24px', color: '#1a2535'}} onClick={() => dispatch(setActiveTab('productCustomization'))}>
          Configure Options
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}

export default SidebarBreadcrumbs;