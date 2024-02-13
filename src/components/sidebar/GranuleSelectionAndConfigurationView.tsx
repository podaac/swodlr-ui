import CustomizeProductsSidebar from './CustomizeProductsSidebar';
import { GranuleSelectionAndConfigurationViewProps } from '../../types/constantTypes';
import WorldMap from '../map/WorldMap'
import { setShowTutorialModalTrue, setSkipTutorialTrue } from './actions/modalSlice';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { checkUseHasCorrectEdlPermissions } from '../edl/AuthorizationCodeHandler';
import { setUserHasCorrectEdlPermissions } from '../app/appSlice';

const GranuleSelectionAndConfigurationView = (props: GranuleSelectionAndConfigurationViewProps) => {
  const dispatch = useAppDispatch()
  const skipTutorial = useAppSelector((state) => state.modal.skipTutorial)
  const {mode} = props

  useEffect(() => {
    const fetchData = async () => {
      const userHasCorrectEdlPermissions = await checkUseHasCorrectEdlPermissions()
      dispatch(setUserHasCorrectEdlPermissions(userHasCorrectEdlPermissions))
    }
  
    // call the function
    fetchData()
  }, [])
  
  useEffect(() => {
    if (!skipTutorial) {
      dispatch(setShowTutorialModalTrue())
      dispatch(setSkipTutorialTrue())
    }
  }, []);

  return (
    <>
      <CustomizeProductsSidebar mode={mode}/>
      <WorldMap />
    </>
  );
}

export default GranuleSelectionAndConfigurationView;