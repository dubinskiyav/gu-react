import React from 'react';
import App from './App';
import { withRouter } from "react-router";
import ModuleHeader from "./lib/ModuleHeader";

const MOD_TITLE = "Справка";

/**
 * Непонятно где используется
 * @param {*} props 
 */
const Help = (props)=>{
  let helpPath = "/help/pagenotfound";
  if (props.location) {
    helpPath = props.location.pathname;
  }
  console.log("Help  helpPath = " + helpPath);
  return (
          <App  subsystem={'none'} menu={'none'} submenu={'none'}>
            <ModuleHeader title={MOD_TITLE}/>
              <p>{props.helpId}</p>
              <p>Здесь система помощи. Запрашивается топик {helpPath}</p>
          </App>
  )
}
export default withRouter(Help); // https://stackoverflow.com/questions/53539314/what-is-withrouter-for-in-react-router-dom

