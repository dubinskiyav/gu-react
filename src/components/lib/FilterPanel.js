import React, { useState } from 'react';
import {Space} from 'antd';

/**
 * Панель фильтра 
 * @param {*} props 
 */
const FilterPanel = (props)=>{
    // Объявляем пустую переменную состояния config    https://ru.reactjs.org/docs/hooks-state.html
    const [config] = React.useState({});

    // Смена элемента key на значение val
    const changed = (key,val)=>{
        config[key] = val; // запишем в config новое значение
        if (props.onChange) {
            props.onChange(config); // вызовем переданный метод onChange
        }
    }

    let allFilters =  props.children.props.children; // Массив всех фильтров, так как props.children это ReactFragment
    if (!allFilters.length) { // Это один элемент, а не массив
        allFilters=[allFilters]; // сделаем массив из одного элемента
     }
    // https://ru.reactjs.org/docs/react-api.html#cloneelement
    // Клонируем элементы-фильтры, добавим к ним метод onChange
    // который запишет состояние и вызовет родительский onChange, который должен обязательно быть
    return (
        <Space className="filter-panel">
            {allFilters.map((c)=>React.cloneElement(c, {
                onChange: (value)=>changed(c.key,value),
                key:c.key
            }))}
        </Space>    
    )    
}

export default FilterPanel;
