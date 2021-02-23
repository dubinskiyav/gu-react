import React from 'react';
import App from '../../App';
import ModuleHeader from "../../lib/ModuleHeader";

const MOD_TITLE = "Бухгалтерский учет";


const Acc = (props)=>{
  return (
        <App subsystem={'acc'} menu={'none'} submenu={'none'}
            breadcrumb={[{label:'Бухгалтерский учет'}]}>
            <ModuleHeader title={MOD_TITLE}/>
            <p>
            Бухгалтерский учет
            </p>
        </App>
  )
}
export default Acc;
