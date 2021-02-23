import React from 'react';
import App from '../../App';
import ModuleHeader from "../../lib/ModuleHeader";

const MOD_TITLE = "Нормативно-справочная информация";

const ReferenceBooks = (props)=>{
  return (
        <App subsystem={'referencebooks'} menu={'none'} submenu={'none'}
            breadcrumb={[{label:'НСИ'}]}>
            <ModuleHeader title={MOD_TITLE}/>
            <p>
            Общая информация о справочниках и т.д.
            </p>
        </App>
  )
}
export default ReferenceBooks;
