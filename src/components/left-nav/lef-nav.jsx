import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';
import './index.less';
import { Menu } from 'antd';
import { Icon } from '@ant-design/compatible';
import memoryUtils from '../../utils/memoryUtils'
const { SubMenu } = Menu;
/*左侧导航的组件*/

class LeftNav extends Component {
    // 根据menu的数据数组生成对应的标签数组
    // 使用map() + 递归调用
    // getMenuNodes = (menuList) => {
    //     return menuList.map(item => {
    //         if (!item.children) {
    //             return (
    //                 <Menu.Item key={item.key}>
    //                     <Link to={item.key}>
    //                     <Icon type={item.icon} />
    //                         <span>{item.title}</span>
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         } else {
    //             return (
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <span>
    //                         <Icon type={item.icon} />
    //                             <span>{item.title}</span>
    //                         </span>
    //                     }
    //                 >
    //                     {this.getMenuNodes(item.children)}
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }
// 判断当前登录用户对item是否有权限
    hasAuth = (item)=>{
        const key = item.key;
        const menus = memoryUtils.user.role.menus;
       
        // 1、如果当前用户是admin
        //2、当前item公开的
        // 3、当前用户有此item的权限 key 有没有在menus中
        if(memoryUtils.user.username === 'admin' || item.isPublic || menus.indexOf(key)!== -1){
            return true;
        }else if(item.children){ //某个子item的权限
           return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false;

    }
     // 根据menu的数据数组生成对应的标签数组
    // 使用reduce() + 递归调用
    getMenuNodes = (menuList) =>{
        
        // 得到当前请求的路由路径
        const path = this.props.location.pathname;
        return menuList.reduce((pre,item)=>{
        // 如果当前用户有item对应的权限，才需要显示对应的菜单项
        if(this.hasAuth(item)){
            // 向pre中添加<Menu.Item>
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                       <Link to={item.key}>
                         <Icon type={item.icon} />
                           <span>{item.title}</span>
                       </Link>
                    </Menu.Item>
                ))
            }else{
                // 查找一个与当前请求路径匹配的子Item
                const cItem =  item.children.find(cItem => path.indexOf(cItem.key) !== -1)
                if(cItem){
                    // 如果存在，说item的子列表需要打开
                    this.openKey = item.key
                }
                pre.push((
                <SubMenu
                    key={item.key}
                    title={
                        <span>
                         <Icon type={item.icon} />
                        <span>{item.title}</span>
                        </span>
                    }
                >
                    {this.getMenuNodes(item.children)}
                </SubMenu>
                ))
            }
        }
            
            // 想pre 添加<SubMebu>
            return pre
        },[])
    }
    // 在第一次render()之前执行一次
    // 为第一次render()准备数据(必须同步的)
    UNSAFE_componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        // 得到当前请求的路由路径
        let path = this.props.location.pathname;
        if(path.indexOf('/product') !== -1){
            //当前请求的是商品或其子路由
            path = '/product'
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="logo"></img>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]}>
                    {
                        this.menuNodes
                    }
                </Menu>
                    
                
            </div>
        )
    }
}

// withRouter高阶组件：
// 包装非路由组件，返回一个新的组件
// 新的组件向非路由组件传递3个属性：history/location/math
export default withRouter(LeftNav);