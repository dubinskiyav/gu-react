import React from "react";
import { Radio } from 'antd';

/**
 * Вспомогательная обертка для ратио группы
 * Возвращает новый компонент - Radio.Group, который умеет переключаться 
 * и сохранять состояние в props
 * @param {*} props 
 */
const RadioGroup=(props)=>{
    // Создаем у функционального компонента элемент состояния с именем value1
    // и функцию для его установки с именем setValue1
    const [value1, setValue1] = React.useState(props.initValue);
    const change=(e)=>{
        // Сохраним состояние с новым значением взяв у прилетевшего события tagret
        // а у него value (так как мы знаем, что это radio)
        setValue1(e.target.value);
        // Вызовем рлдительский метод, который, возможно, был установлен
        props.onChange(e);
    }
    return <Radio.Group {...props} value={value1} onChange={change}>
        {props.children}
    </Radio.Group>
}

export default RadioGroup;