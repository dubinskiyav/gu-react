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
          <h2 className="mod-title">{props.title}</h2>
          {/* Выводим полученный через props title */}
      </div>
    );
}    

export default ModuleHeader;
