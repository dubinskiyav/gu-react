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
    let [loading,setLoading]= React.useState(false);

    //Загрузка данных для изменения по id или добавления
    const load = ()=>{
        setLoading(true);
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
            setLoading(false);
            console.log("record = " + JSON.stringify(record));
            // Проверим ошибку
            const { errorCode, errorMessage } = record;
            if ( errorCode || errorMessage ) {
                console.log('errorMessage=', errorMessage);
                notification.error({
                    message: 'Ошибка получения данных',
                    description: (errorMessage)
                });
                props.afterCancel();
                setData(null);
            } else {
                setData(record); // данные новые
            }
        },
        (error) => {
            notification.error({
                message:"Ошибка при выборке за пределами программы",
                description: "error"
            });
            console.log('refreshData - error=' + error);
            setLoading(false);
        });
    }

    if(!data && props.visible) {
        setData({});
        load();
    }


    //Сохранение
    const save=(values,after)=>{
        setLoading(true);
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
            console.log("dataNew = ",  dataNew);
            const { errorCode, errorMessage } = dataNew;
            if ( errorCode || errorMessage ) {
                console.log('errorCode=', errorCode);
                const { errorCause } = dataNew;
                notification.error({
                  message: (errorMessage),
                  description: (errorCause)
                });
                setLoading(false);
                console.log('refreshData - error = ', dataNew);
            } else {
                // в случае успеха
                setLoading(false);
                after();
            }
        },
        (error) =>  {
            console.log("error = ",  error);
            const { errorMessage, errorCause } = error;
            notification.error({
                message: (errorMessage),
                description: (errorCause)
            });
            console.log('refreshData - error=' + error);
            setLoading(false);
        });
    }

    return <Modal
        visible={props.visible }
        confirmLoading={loading}
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