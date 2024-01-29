import CustomizeProductsSidebar from './CustomizeProductsSidebar';
import { GranuleSelectionAndConfigurationViewProps } from '../../types/constantTypes';
import WorldMap from '../map/WorldMap'
import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { setUserHasCorrectEdlPermissions } from '../app/appSlice';
import { checkUseHasCorrectEdlPermissions } from '../edl/AuthorizationCodeHandler';

const GranuleSelectionAndConfigurationView = (props: GranuleSelectionAndConfigurationViewProps) => {
  const {mode} = props
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchData = async () => {
      const userHasCorrectEdlPermissions = await checkUseHasCorrectEdlPermissions()
      dispatch(setUserHasCorrectEdlPermissions(userHasCorrectEdlPermissions))
    }
  
    // call the function
    fetchData()
  }, [])
  
  return (
    <>
      <CustomizeProductsSidebar mode={mode}/>
      <WorldMap />
    </>
  );
}

export default GranuleSelectionAndConfigurationView;