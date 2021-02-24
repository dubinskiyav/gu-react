import React from 'react';
import { Space, Button, Table, notification, Checkbox,Form } from 'antd';
import { Radio } from 'antd';
import {CheckOutlined} from '@ant-design/icons';
import reqwest from 'reqwest';
import App from '../../App';
import ModuleHeader from "../../lib/ModuleHeader";
import FilterPanel from "../../lib/FilterPanel";
import {BUTTON_ADD_LABEL,BUTTON_DEL_LABEL,BUTTON_REFRESH_LABEL,MSG_CONFIRM_DELETE} from "../../lib/const";
import * as globalSettings from "../../lib/const";
import RadioGroup from "../../lib/RadioGroup";
import EditForm from "../../lib/EditForm";
import {confirm} from "../../lib/Dialogs";
import { format } from 'react-string-format';
import EdizmForm from "./EdizmForm";

const MOD_TITLE = "Единицы измерения";
const MODE_HELP_ID = "/help/edizm";

// позиция в меню
// в subsystem - key верхнего меню
const MNU_SUBSYSTEM = "referencebooks";
const HREF_SUBSYSTEM = "/referencebooks";
const NAME_SUBSYSTEM = "НСИ";
// в menu - key бокового главного
const MNU_MENU = "catalog";
const NAME_MENU = 'Общесистемные справочники';
// в submenu - key бокового подменю (финальный пункт)
// его имя равно имени модуля
const MNU_SUMMENU = 'catalog.edizm';
// кол-во записей на страницу, по умолчанию
const DEFAULT_PAGE_SIZE = 3
// автоматическое обновление при монтировании компонента
const AUTO_REFRESH = true;
// URI для использования формой добавления/изменения
const URI_ROOT = globalSettings.startURL + "edizm"
const URI_SELECT = URI_ROOT + "/read"
const URI_READ_BY_ID = URI_ROOT + "/readbyid" 
const URI_READ_FOR_ADD = URI_ROOT + "/readforadd"
const URI_INSERT = URI_ROOT + "/insert"
const URI_UPDATE = URI_ROOT + "/update"
const URI_DELETE = URI_ROOT + "/delete"

// колонки в таблице
// id не надо! - Его описать в key таблицы
const COLUMNS=[
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'edizm_name',
        sorter: {
            multiple: 1,
        },
        /*defaultSortOrder:"ascend",*/
    },
    {
        title: 'Обозначение',
        dataIndex: 'notation',
        key: 'edizm_notation',
        sorter: {
            multiple: 1,
        },
    },
    {
        title: 'Флаг блокировки',
        dataIndex: 'blockflag',
        key: 'edizm_blockflag',
        render:(blockflag)=>blockflag !==0 ?<CheckOutlined />:"",
        sorter: {
            multiple: 1,
        },
    },
    {
        title: 'Код',
        dataIndex: 'code',
        key: 'edizm_code',
        sorter: {
            multiple: 1,
        },
    },
]  
const idName = "edizm_id";

// Форма для редактирования
const buildForm = (form)=>{
    return <EdizmForm form={form} initialValues={{}}/>
}

const Edizm = (props)=>{
    let [data,setData] = React.useState(null); // Основной массив данных - пустой сначала
    let [selectRows,setSelectRows] = React.useState([]);
    // Параметры запроса для выборки данных
    let [requestParams, setRequestParams] = React.useState({
        // параметры запроса по умолчанию
        pagination:{
            showSizeChanger:true, 
            current:1, 
            pageSize:DEFAULT_PAGE_SIZE, 
            total: DEFAULT_PAGE_SIZE * 2, // общее количество считанных записей
        },
        sort:[{field:idName,order:'ascend'}],
    });
    let [loading,setLoading] = React.useState(false); // Момент загрузки данных для блокировки таблицы для действий
    let [totalMax, setTotalMax] = React.useState(0); // Наибольшее количесвто выбранных записей
    const [form] = Form.useForm(); // Форма для редактирования
    let [formVisible,setFormVisible] = React.useState(false); // Видимость формы
    // Контекст для редактирования - урлы
    let [editorContext] = React.useState({
      uriForEdit:URI_READ_BY_ID,
      uriForAdd:URI_READ_FOR_ADD,
      uriForIns:URI_INSERT, 
      uriForUpd:URI_UPDATE,
    });


    // key это уникальное имя фильтра, попадает в REST API
    const buildFilters = ()=>{
        // Обязательно назначить key у элемента
        return <React.Fragment>
            <Checkbox key="onlyBlock">Только заблокированные</Checkbox>
            {/* Смотреть комментарии в RadioGroup */}
            <RadioGroup key="blockFlag" initValue={1}>
                <Radio value={1}>Все</Radio>
                <Radio value={2}>Заблокированные</Radio>
                <Radio value={3}>Не запблкированные</Radio>
            </RadioGroup>
        </React.Fragment>
    }
    
      
    /**
    * Обработчик смены параметров запроса из таблицы
    * @param {*} paginationNew // При смене пагинации
    * @param {*} filters // фильтра
    * @param {*} sorter  // сортировки
    */
    const request =  (pagination, filters, sorter)=>{
        console.log("pagination = " + pagination);
        if (sorter.field) { // Установлена единичкая сортировка
            requestParams.sort = [{
                field: sorter.field, 
                order: sorter.order
            }];
          } else { // Возможно, установлена множественная сортировка
            console.log("sorter.length = " + sorter.length);
            if (sorter.length > 0) {
                requestParams.sort = [];
                Object.keys(sorter).forEach(element => {
                    if (sorter[element].field)
                        requestParams.sort.push({
                        field: sorter[element].field,
                        order: sorter[element].order,
                    });
                });
            }
          }
        requestParams.pagination.current = pagination.current;
        requestParams.pagination.pageSize = pagination.pageSize;
        refreshData();
    }
        
    // Установка фильтра
    const setFilters = (config)=>{
        //debugger;
        console.log("config = ", config);
        // Обнулим фильтры
        //requestParams.filters = [];
        //Установим фильтры
        // проверим чекбокс
        if (config.blockRatio) {

            //blockRatioValue = 2;
        }
        requestParams.filters = {
            onlyBlock:config.onlyBlock?config.onlyBlock.target.checked:false,
            blockFlag:config.blockFlag?config.blockFlag.target.value:1,
        }
        refreshData();
    }

    /**
    * Основная перевыборка данных
    */
    const refreshData = () => {
        console.log('refreshData - start');

        setLoading(true);
        const gelRequestParam = {
            pageNumber: requestParams.pagination.current - 1,
            pageSize: requestParams.pagination.pageSize,
            sort: requestParams.sort,
            filters: requestParams.filters,
        };
        // текущие параметры запроса
        console.log("gelRequestParam", gelRequestParam);

        // Вычисляем total для таблицы
        let total = (gelRequestParam.pageNumber + 2) * gelRequestParam.pageSize;
        if (total < totalMax) {
            total = totalMax;
        } else {
            totalMax = total;
            setTotalMax(total);
        }
        // запрос к REST API на выборку
        reqwest({
            url: URI_SELECT,
            contentType: "application/json; charset=utf-8",
            method: 'post',
            type: 'json',
            data:JSON.stringify(gelRequestParam)
        })
        .then(dataNew => {
            //console.log("dataNew = ", dataNew);
            // Проверим ошибку
            const { errorCode } = dataNew;
            if ( errorCode ) {
                console.log('errorCode=', errorCode);
                const { errorMessage, errorCause } = dataNew;
                notification.error({
                  message: (errorMessage),
                  description: (errorCause)
                });
                console.log('refreshData - error = ', dataNew);
                setLoading(false);
            } else {
                setData(dataNew); // данные новые
                // переустановим total у таблицы
                requestParams.pagination.total =  total; 
                // сброс отметок записей
                setSelectRows([]);
                setLoading(false);
            }
        },
        // todo Сделать обработку ошибок
        (error) => {
            notification.error({
                message:"Ошибка при выборке за пределами программы",
            });
            console.log('refreshData - error = ', error);
            setLoading(false);
        }
        );
        console.log('refreshData - finish');
    }

    const deleteData = ()=>{
        let ids = selectRows.join(',');
        confirm(format(MSG_CONFIRM_DELETE,selectRows.length),()=>{
            console.log("Delete record "+ids);
            setLoading(true); // Блокируем отклики таблицы
            reqwest({
                url: URI_DELETE + '/' + ids,
                contentType: "application/json; charset=utf-8",
                method: 'post',
                type: 'json',
            }).then((responseJson) => {
                console.log('responseJson=', responseJson);
                const { errorCode } = responseJson;
                if (errorCode) { // Ошибка есть
                    console.log('errorCode=', errorCode);
                    const { errorMessage, errorCause } = responseJson;
                    notification.error({
                        message: (errorMessage),
                        description: (errorCause)
                    });
                } else { // ошибки нет
                    console.log('Удалили ' + ids);
                    refreshData();
                    const description = "Удаление " + selectRows.length + " записей выполнено успешно";
                    notification.success({
                        message:"Успешно",
                        description: (description)
                    });
                }
                setLoading(false);
            });
        })
    }

    React.useEffect(() => {
        if(!data && AUTO_REFRESH) {
          setData([]); // важно, иначе начальный refresh выполняется несколько раз
          refreshData();
        }
    });

    const rowSelection={
        selectedRowKeys:selectRows,
        onChange:(rows)=>{
            setSelectRows(rows);
        }
    }
        
    const callForm = (id)=>{
        console.log("callForm id = ", id);
        form.resetFields();
        editorContext.id = id;
        setFormVisible(true);
    }
    
    return (
        <App subsystem={MNU_SUBSYSTEM} menu={MNU_MENU} submenu={MNU_SUMMENU}
             breadcrumb={[{label:NAME_SUBSYSTEM,href:HREF_SUBSYSTEM},{label:NAME_MENU},{label:MOD_TITLE}]}
             helpId={MODE_HELP_ID}>
            <ModuleHeader title={MOD_TITLE}
                buttons={[
                    <Button key="del" onClick={()=>deleteData()} disabled={loading || selectRows.length===0}>{BUTTON_DEL_LABEL}</Button>,
                    <Button key="refresh" onClick={()=>refreshData()} disabled={loading}>{BUTTON_REFRESH_LABEL}</Button>,
                    <Button key="add" onClick={()=>callForm()} type="primary">{BUTTON_ADD_LABEL}</Button>,                  
                ]}
            />
            <FilterPanel  onChange={(fc)=>setFilters(fc)}>
              {buildFilters()}
            </FilterPanel>
            <Table className="mod-main-table" 
                rowClassName="table-editable-row"  
                columns={COLUMNS}
                dataSource={data}
                loading={loading}
                bordered
                rowSelection={rowSelection}
                pagination={requestParams.pagination}
                rowClassName="table-editable-row"  
                onChange={request}
                rowKey="id"
                size={"middle"}
                showSorterTooltip={false}
                onRow={(record, rowIndex) => {
                    return {
                      onClick: event => callForm(record.id)
                    };
                }}
            />

            <EditForm visible={formVisible}
                form={form}
                editorContext={editorContext}
                afterSave={()=>{
                    setFormVisible(false);
                    refreshData()
                }}
                afterCancel={()=>{
                    setFormVisible(false);
                }}
            >
                {buildForm(form)}
            </EditForm>


        </App>
    )
}
export default Edizm;
