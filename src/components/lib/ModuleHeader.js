import React from 'react';
import {Button} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';

/**
 * Заголовок модуля
 * @param {*} props 
 */
const ModuleHeader = (props)=>{
    return (
      <div className="mod-header">
        {/* Кнопка со стрелочкой назад - на предыдущую страницу */}
        <Button    
          icon = {<ArrowLeftOutlined/>}
          className="back-button"
          onClick ={() => window.history.back()}
        />
        {/* Выводим полученный через props title */}
        <h2 className="mod-title">{props.title}</h2>  
        <div style={{marginLeft: 'auto'}}></div>
        <div className="mod-buttons">
          {/* Переданные в props кнопки */}
          {props.buttons}
        </div>
      </div>
    );
}    

export default ModuleHeader;
