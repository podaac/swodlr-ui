import CustomizeProductsSidebar from './CustomizeProductsSidebar';
import { GranuleSelectionAndConfigurationViewProps } from '../../types/constantTypes';
import WorldMap from '../map/WorldMap'
import { useState } from 'react';

const GranuleSelectionAndConfigurationView = (props: GranuleSelectionAndConfigurationViewProps) => {
  const {mode} = props
  
  return (
    <>
      <CustomizeProductsSidebar mode={mode}/>
      <WorldMap />
    </>
  );
}

export default GranuleSelectionAndConfigurationView;