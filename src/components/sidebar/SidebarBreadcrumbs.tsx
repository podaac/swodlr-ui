import { Breadcrumb } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarBreadcrumbs = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const { search } = useLocation();

  return (
    <div style={{marginTop: '10px'}}>
      {/* <hr className={`${colorModeClass}-text`} style={{marginTop: '0px', backgroundColor: 'black', borderWidth: '0px', opacity: 1}} /> */}
      <Breadcrumb style={{backgroundColor: '#1A2535', paddingLeft: '20px', paddingBottom: '1px', paddingTop: '8px'}}>
        <Breadcrumb.Item className='sidebar-breadcrumb-item' id='select-scenes-breadcrumb' active={location.pathname.includes("/customizeProduct/selectScenes")} style={{fontSize: '22px', color: 'white'}} onClick={() => navigate(`/customizeProduct/selectScenes${search}`)}>
          Select Scenes
        </Breadcrumb.Item>
        <Breadcrumb.Item className='sidebar-breadcrumb-item' id='configure-options-breadcrumb' active={location.pathname.includes("/customizeProduct/configureOptions")} style={{fontSize: '22px', color: 'white'}} onClick={() => navigate(`/customizeProduct/configureOptions${search}`)}>
          Configure Options
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}

export default SidebarBreadcrumbs;