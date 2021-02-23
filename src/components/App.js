import React from 'react';
import '../resources/css/App.css';

import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb} from 'antd';
import { InfoCircleOutlined, AppstoreOutlined, HomeOutlined } from "@ant-design/icons";
import { UserOutlined, AuditOutlined, ProfileOutlined, ShopOutlined, ProjectOutlined  } from '@ant-design/icons';
import {Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

/* Ссылка с иконкой */
const IconLink = ({ icon, text, href }) => (
  <a target="_blank" rel="noreferrer" className="footer-link" href={href}>
    {icon}<span className="footer-link-text">{text}</span>
  </a>
);

// здесь левое меню, в зависимости от subsystem
const getSubMenu=(sys)=>{
  let syss = sys;
  // Фрагменты https://ru.reactjs.org/docs/fragments.html
  switch (syss) {
    case 'referencebooks': {/* НСИ */}
      return (<React.Fragment>
        <SubMenu key="catalog" icon={<ProfileOutlined/>} title="Общесистемные справочники">
          <Menu.Item key="catalog.edizm">
            <Link to="/edizm">Единицы измерения</Link>
          </Menu.Item>
          <Menu.Item key="catalog.material">
            <Link to="/material">Материалы</Link>
          </Menu.Item>
          <Menu.Item key="catalog.priznak">
            <Link to="/priznak">Признаки</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="object" icon={<AppstoreOutlined/>} title="Объекты">
          <Menu.Item key="object.object">Объекты</Menu.Item>
          <Menu.Item key="object.bank">Банки</Menu.Item>
          <Menu.Item key="object.company">Организации</Menu.Item>
          <Menu.Item key="object.people">Физические лица</Menu.Item>
        </SubMenu>
      </React.Fragment>)
    case 'storage': {/* Складской учет */}
      return (<React.Fragment>
        <SubMenu key="catalog" icon={<AppstoreOutlined/>} title="Справочники">
          <Menu.Item key="catalog.storage">
            <Link to="/storage">Справочник складов</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="work" icon={<ShopOutlined/>} title="Работа">
          <Menu.Item key="work.object">Приход</Menu.Item>
          <Menu.Item key="work.bank">Расход</Menu.Item>
          <Menu.Item key="work.report">Отчетность</Menu.Item>
          <Menu.Item key="work.setting">Настройки</Menu.Item>
        </SubMenu>
      </React.Fragment>)
    case 'acc': {/* Бухгалтерский учет */}
      return (<React.Fragment>
        <SubMenu key="system" icon={<ProfileOutlined/>} title="Справочники">
          <Menu.Item key="system.chart">План счетов</Menu.Item>
        </SubMenu>
        <SubMenu key="work" icon={<ProjectOutlined/>} title="Работа">
          <Menu.Item key="work.contractor">Работа с поставщиками и подрядчиками</Menu.Item>
          <Menu.Item key="work.bank">Банковские операции</Menu.Item>
          <Menu.Item key="work.report">Отчетность</Menu.Item>
          <Menu.Item key="work.setting">Настройки</Menu.Item>
        </SubMenu>
      </React.Fragment>)
    case 'admin': {/* Администрирование */}
      return (<React.Fragment>
        <SubMenu key="help" icon={<AppstoreOutlined/>} title="Помощь">
          <Menu.Item key="help.usefullinks">
              <Link to="/usefullinks">Полезные ссылки</Link>
            </Menu.Item>
        </SubMenu>
        <SubMenu key="develop" icon={<AppstoreOutlined/>} title="В разработке">
          <Menu.Item key="develop.user">
            <Link to="/user">Пользователи</Link>
          </Menu.Item>
          <Menu.Item key="develop.audit">
            <Link to="/audit">Аудит</Link>
          </Menu.Item>
          <Menu.Item key="develop.test01">
            <Link to="/test01">Тест 01</Link>
          </Menu.Item>
        </SubMenu>
      </React.Fragment>)
  default:
  }
}


/**
 * Основной компонент. 
 * @param {*} props 
 */
const App = (props)=>{
  let subsystem = props.subsystem;
  var [collapsed,setCollapse] = React.useState(false);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} collapsible collapsed={collapsed} onCollapse={setCollapse}>
        <Link to="/"><div className="logo">Геликон Утилиты</div></Link>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={[props.menu]}
          defaultSelectedKeys={[props.submenu]}
          style={{ height: '100%', borderRight: 0 }}
        >
          {getSubMenu(subsystem)}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} >
          <Menu 
            theme="dark" 
            mode="horizontal" 
            defaultSelectedKeys={[props.subsystem]}
          >
            <Menu.Item key="referencebooks">
              <Link to="/referencebooks">НСИ</Link>
            </Menu.Item>
            <Menu.Item key="storage">
              <Link to="/storage">Складской учет</Link>
            </Menu.Item>
            <Menu.Item key="acc">
              <Link to="/acc">Бухгалтерский учет</Link>
            </Menu.Item>
            <Menu.Item key="admin">
              <Link to="/admin">Администрирование</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {props.breadcrumb?<Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>:''}
            {props.breadcrumb?
              props.breadcrumb.map((o,idx)=>
              <Breadcrumb.Item {...(o.href?{href:o.href}:{})} key={idx}>
                  {o.label}
                </Breadcrumb.Item>)
              :''
            }
            {/*  у нас объект obj = {foo:"abc", bar:"def"} Когда в теге записываем {...obj} тег получает пропсы foo="abc" bar="def" */}
          </Breadcrumb>
          <div className="site-layout-workspace">
            {props.children}   {/* рендерим все, что передано внутри него при вызове */}
          </div>
        </Content>
        <Footer style={{padding:'13px 32px' }}>
          Gelicon Pro ©2021
          {props.helpId?<IconLink text="Помощь" icon={<InfoCircleOutlined/>} href={props.helpId}/>:""}
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
