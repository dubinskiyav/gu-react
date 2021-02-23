import React from 'react';
import App from './App';
import ModuleHeader from "./lib/ModuleHeader";

const MOD_TITLE = "Gelicon Utilities - главная страница";
const MOD_HELP_ID="http://www.gelicon.biz/"

/**
 * Главная страница системы Gelicon Utilites
 * @param {*} props 
 */
const Main = (props)=>{
  return (
          <App subsystem={'none'} menu={'none'} submenu={'none'} helpId={MOD_HELP_ID}>
            <ModuleHeader title={MOD_TITLE}/>
              {/* В ModuleHeader передаем props - title,
              который в тексте ModuleHeader обрабатываем  */}
              <p>
                Gelicon Utilities - комплексное решение, автоматизирующее основные 
                бизнес-процессы обслуживания сетевой инфраструктуры коммунальных 
                компаний.
              </p>
              <p>
                Данное решение позволяет значительно повысить эффективность 
                работы подразделений, оптимизировать затраты и снизить аварийность.
              </p>
          </App>
  )
}
export default Main;
