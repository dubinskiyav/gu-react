import React from 'react';
import {Modal, notification} from 'antd';
import reqwest from 'reqwest';


/**
 * Форма-обертка для модификации данных
 * @param {*} props 
 */
const EditForm = (props)=>{
    // данные
    let [ data, setData]  = React.useState(null);
    let loadingFlag = true;

    //Загрузка данных для изменения по id или добавления
    const load = ()=>{
        let url = props.editorContext.uriForAdd;
        if(props.editorContext.id) {
            url = props.editorContext.uriForEdit + '/' + props.editorContext.id;
        }
        // запрос к REST API на выборку по id
        reqwest({
            url: url,
            contentType: "application/json; charset=utf-8",
            method: 'get',
            type: 'json',
        }).then(record => {
            console.log("record = " + JSON.stringify(record));
            // Проверим ошибку
            const { errorCode } = record;
            if ( errorCode ) {
                setTimeout(() => {
                    loadingFlag = false;
                }, 1000);
                const { errorMessage } = record;
                console.log('errorMessage=', errorMessage);
                notification.error({
                    message: 'Ошибка получения данных',
                    description: (errorMessage)
                });
            } else {
                setData(record); // данные новые
            }
        },
        // todo Сделать обработку ошибок
        (error) => {
            notification.error({
                message:"Ошибка при выборке за пределами программы",
                description: "error"
            });
            console.log('refreshData - error=' + error);
        });
    }

    if(!data && props.visible) {
        loadingFlag = true;
        load();
    }


    //Сохранение
    const save=(values,after)=>{
        const record = { // сцепим id и vslues в один объект
            "id": props.editorContext.id,
            ...values
        }
        let url = props.editorContext.uriForIns;
        if(props.editorContext.id) {
            url = props.editorContext.uriForUpd;
        }
        console.log("url = ",  url);
        console.log("record = ",  record);
        reqwest({
            url: url,
            contentType: "application/json; charset=utf-8",
            method: 'post',
            type: 'json',
            data:JSON.stringify(record)
        }).then((dataNew) => {
            const { errorCode } = dataNew;
            if ( errorCode ) {
                console.log('errorCode=', errorCode);
                const { errorMessage, errorCause } = dataNew;
                notification.error({
                  message: (errorMessage),
                  description: (errorCause)
                });
                console.log('refreshData - error = ', dataNew);
            } else {
                // в случае успеха
                after();
            }
        })

    }

    return <Modal
        visible={props.visible  && loadingFlag }
        title={props.editorContext.id?"Изменение записи":"Новая запись"}
        okText={props.editorContext.id?"Изменить":"Добавить"}
        cancelText="Отмена"
        onCancel={()=>{
            props.afterCancel();
            setData(null);
        }}
        onOk={() => {
                props.form.validateFields()
                    .then((values) => {
                        save(values,()=>{
                            props.afterSave(values);
                            setData(null);
                        })
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
        }}>
    {props.children?React.cloneElement(props.children,{initialValues:data}):null}
  </Modal>    

}    

export default EditForm;