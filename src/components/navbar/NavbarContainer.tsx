import PodaacNavbar from './PodaacNavbar';
import MainNavbar from './MainNavbar';

const NavbarContainer = (props: {showMainNavbar: boolean}) => {
  const {showMainNavbar} = props
  
  return (
  <div className="fixed-top">
    <PodaacNavbar />
    {showMainNavbar ? <MainNavbar /> : null}
  </div>
  );
}

export default NavbarContainer;