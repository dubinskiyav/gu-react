import React from 'react';
import App from '../../App';
import ModuleHeader from "../../lib/ModuleHeader";

const MOD_TITLE = "Складской учет";

const Storage = (props)=>{
  return (
        <App subsystem={'storage'} menu={'none'} submenu={'none'}
            breadcrumb={[{label:'Складской учет'}]}>
            <ModuleHeader title={MOD_TITLE}/>
            <p>
            Здесь будет склад 
            </p>
        </App>
  )
}
export default Storage;
