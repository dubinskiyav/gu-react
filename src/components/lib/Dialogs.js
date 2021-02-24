import React from 'react';
import { Modal } from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';

export const confirm = (text,okClick)=>{
    Modal.confirm({
        title: text,
        icon: <ExclamationCircleOutlined />,
        onOk:okClick
      });
    
}
