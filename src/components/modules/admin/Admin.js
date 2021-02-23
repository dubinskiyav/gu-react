import React from 'react';
import App from '../../App';
import ModuleHeader from "../../lib/ModuleHeader";

const MOD_TITLE = "Администрирование";

const Admin = (props)=>{
  return (
        <App subsystem={'admin'} menu={'none'} submenu={'none'}
            breadcrumb={[{label:'Администрирование'}]}>
            <ModuleHeader title={MOD_TITLE}/>
            <p>
            Администрирование
            </p>
        </App>
  )
}
export default Admin;
