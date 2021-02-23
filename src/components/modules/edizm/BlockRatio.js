import React from "react";
import { Checkbox, Radio,  } from 'antd';

/**
 * Элемент фильтра для модуля
 */
function BlockRatio(props) {
    const {value} = props;
    return (
        <Radio.Group key="blockRatio" value={value}>
            <Radio value={1}>Все</Radio>
            <Radio value={2}>Заблокированные</Radio>
            <Radio value={3}>Не запблкированные</Radio>
        </Radio.Group>
    );
}

export default BlockRatio;