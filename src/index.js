import React from 'react';
import ReactDOM from 'react-dom';
import './resources/css/index.css';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import { BrowserRouter,Switch } from "react-router-dom";
import {Route} from 'react-router';

import Main from './components/Main';
import Help from "./components/Help";
import Error from "./components/Error";
import ReferenceBooks from "./components/modules/referencebooks/ReferenceBooks";
import Storage from "./components/modules/storage/Storage";
import Acc from "./components/modules/acc/Acc";
import Admin from "./components/modules/admin/Admin";
import Edizm from "./components/modules/edizm/Edizm";

document.documentElement.lang = 'ru';

/**
 * Точка входа - заменяет элемент root
 */
ReactDOM.render(
  // Установим русский на все
  <ConfigProvider locale={ruRU}> 
    {/* В теле render-а так можно делать комментарии */}
    <BrowserRouter> {/* https://habr.com/ru/post/329996/ */}
      {/* <Switch/> итеративно проходит по дочерним компонентам и рендерит только первый который подходит под location.pathname. */}
      <Switch> {/* Сюда помещаем все объекты, которые хотим маршрутизировать */}
        <Route exact path='/'><Main /></Route> {/* Рендерить только по точному совпадлнию пути*/}
        <Route exact path='/referencebooks'><ReferenceBooks/></Route>
        <Route exact path='/edizm'><Edizm/></Route>
        <Route exact path='/storage'><Storage/></Route>
        <Route exact path='/acc'><Acc/></Route>
        <Route exact path='/admin'><Admin/></Route>
        <Route path='/help'><Help /></Route> {/* Когда location.pathname это '/help' или '/help/2', prop path совпадает */}
        <Route><Error text="Страница не найдена" helpId="/help/pagenotfound"/></Route> {/* Не нашли - ошибка */}
      </Switch>
    </BrowserRouter>
  </ConfigProvider>
  ,document.getElementById('root')
);

