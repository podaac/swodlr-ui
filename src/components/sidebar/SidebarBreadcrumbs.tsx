import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { Breadcrumb } from 'react-bootstrap';
import { setActiveTab } from './actions/sidebarSlice';

const SidebarBreadcrumbs = () => {
  const activeTab = useAppSelector((state) => state.sidebar.activeTab)
  const dispatch = useAppDispatch()

  return (
    <div style={{marginTop: '10px'}}>
      {/* <hr className={`${colorModeClass}-text`} style={{marginTop: '0px', backgroundColor: 'black', borderWidth: '0px', opacity: 1}} /> */}
      <Breadcrumb style={{color: 'black', backgroundColor: '#1A2535', paddingLeft: '20px', paddingBottom: '1px', paddingTop: '8px'}}>
        <Breadcrumb.Item className='sidebar-breadcrumb-item' href="#" style={{fontSize: '22px'}} onClick={() => dispatch(setActiveTab('granuleSelection'))}>
          Select Scenes
        </Breadcrumb.Item>
        <Breadcrumb.Item className='sidebar-breadcrumb-item' href="#" active={activeTab === 'productCustomization'} style={{fontSize: '22px', color: 'white'}} onClick={() => dispatch(setActiveTab('productCustomization'))}>
          Configure Options
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}

export default SidebarBreadcrumbs;