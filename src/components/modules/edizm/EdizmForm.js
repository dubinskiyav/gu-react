import React from 'react';
import { Form, Input,Checkbox } from 'antd';
import {FORM_ITEMS_LAYOUT,FORM_ITEMS_LAYOUT_WITHOUT_LABEL} from "../../lib/const";  

const EdizmForm = (props)=>{
    const firstInputRef = React.useRef(null);

    React.useEffect(()=>{
        props.form.resetFields();
        setTimeout(() => {
            firstInputRef.current.focus({
                cursor: 'end',
            })                
        }, 100);
    })

    return <Form
                {...FORM_ITEMS_LAYOUT}
                form={props.form}
                layout="horizontal"
                name="formEdizm"
                initialValues={props.initialValues}>            
        <Form.Item name="name" label="Наименование"
            rules={[
                {
                    max:50, 
                    message: 'Длина наименования не может быть больше 50',
                },
            ]}>
            <Input ref={firstInputRef} />
        </Form.Item>
        <Form.Item name="notation" label="Обозначение"
            rules={[
                {
                    required: true,
                    message: 'Необходимо определить обозначение',
                },
            ]}>
            <Input style={{width:80}}/>
        </Form.Item>
        <Form.Item name="blockflag" {...FORM_ITEMS_LAYOUT_WITHOUT_LABEL} valuePropName="checked" >
            <Checkbox>Заблокированность</Checkbox>
        </Form.Item>
        <Form.Item name="code" label="Код"
            rules={[
                {
                    required: true,
                    message: 'Необходимо определить код',
                },
                {
                    max:20,
                    message: 'Длина кода не может быть больше 20',
                }
            ]}>
            <Input style={{width:80}}/>
        </Form.Item>
    </Form>
}    

export default EdizmForm;