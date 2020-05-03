import React,{Component} from 'react';
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import{formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api/index.js'
import { Modal} from 'antd';
import LinkButton from '../link-button'

import './index.less';
import storageUtils from '../../utils/storageUtils';
const { confirm } = Modal;

class Header extends Component{
    state={
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'', //天气图片url
        weather:''
    }
    getTime = () =>{
        // 每隔一秒获取当前时间 并更新数据currentTime
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () => {
        // 调用接口请求异步获取数据
        const {dayPictureUrl,weather} = await reqWeather('上海')
        // 更新状态
        this.setState({dayPictureUrl,weather})
    }

    getTitle = () =>{
        // 得到当前请求的路径
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item =>{
            if(item.key === path){ //如果当前item对象的key 与path一样 item的title就是我要现实的title
                title = item.title;
            }else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) !== -1)
                if(cItem){
                    title = cItem.title;
                }
            }
        })
        return title;
    }
// 退出登陆
    logout = ()=>{
        // 显示确认框
        confirm({
            // title: 'Do you Want to delete these items?',
            content: '确定退出吗？',
            okText: '确定',
            cancelText: '取消',
            onOk:() =>{
                console.log('OK',this);
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 跳转到login
                this.props.history.replace('/login')
            }
        });
    }

    /* 第一次render() 之后执行一次
        一般在此执行异步操作：发ajax请求 启动定时器
    */
    componentDidMount(){
        // 获取当前的时间
        this.getTime()
        // 获取当前天气
        // this.getWeather()
    }

    componentWillUnmount(){
        // 清楚定时器
        clearInterval(this.intervalId)
    }
    render(){
        const {currentTime,dayPictureUrl,weather} = this.state;
        const username = memoryUtils.user.username;
        // 得到我当前需要显示的title
        const title = this.getTitle();
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default  withRouter(Header)