import React from 'react';
import ModuleHeader from "../../lib/ModuleHeader";
import App from '../../App';
import {Link } from "react-router-dom";
import * as globalSettings from "../../lib/const";

const MOD_TITLE = "Полезные ссылки";
const MODE_HELP_ID = "/help/edizm";

// позиция в меню
// в subsystem - key верхнего меню
const MNU_SUBSYSTEM = "admin";
const HREF_SUBSYSTEM = "";
const NAME_SUBSYSTEM = "Администрирование";
// в menu - key бокового главного
const MNU_MENU = "help";
const NAME_MENU = 'Помощь';
// в submenu - key бокового подменю (финальный пункт)
// его имя равно имени модуля
const MNU_SUMMENU = 'help.usefullinks';

const Usefullinks = (props)=>{
    return (
        <App subsystem={MNU_SUBSYSTEM} menu={MNU_MENU} submenu={MNU_SUMMENU}
             breadcrumb={[{label:NAME_SUBSYSTEM,href:HREF_SUBSYSTEM},{label:NAME_MENU},{label:MOD_TITLE}]}
             helpId={MODE_HELP_ID}>
            <ModuleHeader title={MOD_TITLE}/>
            <a target="_blank" href="http://localhost:8080/swagger-ui.html">API Утилит Геликона</a>
        </App>
    )
}
export default Usefullinks;
