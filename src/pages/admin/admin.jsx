import React, { Component } from "react";
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/lef-nav'
import Header from '../../components/header/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
const { Footer, Sider, Content } = Layout;


// 后台管理的路由组件
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user;
        // 如果内存中没有存储user ==>当前未登录
        if (!user || !user._id) {
            // 自动跳转至登陆界面(在render()中)
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{ margin:20,backgroundColor: '#fff',maxHeight:'calc(100vh - 190px)',overflowY:'auto' }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: "center", color: "#ccc" }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}