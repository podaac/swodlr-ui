import CustomizeProductsSidebar from './CustomizeProductsSidebar';
import { GranuleSelectionAndConfigurationViewProps } from '../../types/constantTypes';
import WorldMap from '../map/WorldMap'
import { setShowTutorialModalTrue, setSkipTutorialTrue } from './actions/modalSlice';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const GranuleSelectionAndConfigurationView = (props: GranuleSelectionAndConfigurationViewProps) => {
  const dispatch = useAppDispatch()
  const skipTutorial = useAppSelector((state) => state.modal.skipTutorial)
  const {mode} = props
  
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