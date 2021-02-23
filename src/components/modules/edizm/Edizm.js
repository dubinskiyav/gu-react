import React from 'react';
import { Space, Button, Table, notification,Checkbox,Form } from 'antd';
import { Radio } from 'antd';
import {CheckOutlined} from '@ant-design/icons';
import reqwest from 'reqwest';
import App from '../../App';
import ModuleHeader from "../../lib/ModuleHeader";
import FilterPanel from "../../lib/FilterPanel";
import BlockRatio from "./BlockRatio";
import WithBlockRatio from "./WithBlockRatio";
import * as globalSettings from "../../lib/const";

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
const URI_DEL = URI_ROOT + "/delete"
const URI_ADD = URI_ROOT + "/create"
const URI_UPD = URI_ROOT + "/update" 
const URI_POST = URI_ROOT + "/save"

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
            total: null, // общее количество считанных записей
        },
        sort:[{field:idName,order:'ascend'}],
    });
    let [loading,setLoading] = React.useState(false); // Момент загрузки данных для блокировки таблицы для действий
    let [totalMax, setTotalMax] = React.useState(0); // Наибольшее количесвто выбранных записей


    // Создание компонент для фильтров
    const [blockRatioValue, setBlockRatioValue] = React.useState(1);
    
    // key это уникальное имя фильтра, попадает в REST API
    const buildFilters = ()=>{
        // Обязательно назначить key у элемента
        return <React.Fragment>
            <Checkbox key="onlyBlock">Только заблокированные</Checkbox>
            <BlockRatio value={blockRatioValue}/>
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
            onlyBlock:config.onlyBlock?config.onlyBlock.target.checked:false
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
            setData(dataNew); // данные новые
            // переустановим total у таблицы
            requestParams.pagination.total =  total; 
            // сброс отметок записей
            setSelectRows([]);
        },
        // todo Сделать обработку ошибок
        (error) => {
            notification.error({
            message:"Ошибка при выборке за пределами программы",
            description: "error"
            });
            console.log('refreshData - error=' + error);
        }
        );
        setLoading(false);
        console.log('refreshData - finish');
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
        
    return (
        <App subsystem={MNU_SUBSYSTEM} menu={MNU_MENU} submenu={MNU_SUMMENU}
             breadcrumb={[{label:NAME_SUBSYSTEM,href:HREF_SUBSYSTEM},{label:NAME_MENU},{label:MOD_TITLE}]}
             helpId={MODE_HELP_ID}>
            <ModuleHeader title={MOD_TITLE}/>
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
            />
        </App>
    )
}
export default Edizm;
