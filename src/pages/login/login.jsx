import React,{ Component } from "react";
import { Form,Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less';
import logo from '../../assets/images/logo.png';
import {reqLogin} from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { Redirect } from "react-router-dom";
// 用户登录的路由组件
export default class Login extends Component {
    // 对密码进行自定义验证 输入时即执行
    validatorPwd = (rule, value)=>{
        // console.log('validatorPwd()',rule,value);
        return new Promise((resolve,reject) =>{
            if(!value){
                reject('密码必须输入')
            }else if(value.length<4){
                reject('密码长度不能小于4位')
            }else if(value.length>12){
                reject('密码长度不能大于12位')
            }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
                reject('密码必须是英文、数字或下划线组成')
            }else{
                resolve()
            }
        })
    }
    render(){
        // 如果用户已经登陆，自动跳转到管理界面
        const user = memoryUtils.user;
        // 如果内存中没有存储user ==>当前未登录
        if(user && user._id){
            // 自动跳转至管理界面(在render()中)
            return <Redirect to='/' />
        }
        // const {getField}
        const onFinish  = async (values) =>{
            const {username,password} = values;
            // reqLogin(username,password).then(response=>{}).catch(err=>{})
            // 使用async await 简化promise的使用 以同步编码的方式来实现异步流程 异常ajax.js封装时统一处理
            const result = await reqLogin(username,password) //{status:0,msg:xxx}
            if(result.status === 0){ //登陆成功
                //提水登陆成功
                message.success('登陆成功');
                //保存user
                const user = result.data;
                // 保存在内存中
                memoryUtils.user = user;
                // 保存到local中 浏览器内存中
                storageUtils.saveUser(user);
                //跳转至后台管理界面(不需要再回退到登陆界面)
                this.props.history.replace('/')
            }else{ //登陆失败
                message.error(result.msg)
            }
        }
        const onFinishFailed = ({ values, errorFields, outOfDate }) =>{
            console.log('校验失败')
        }
        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form onFinish={onFinish} onFinishFailed={onFinishFailed} className="login-form">
                    <Form.Item  name="username" rules={[
                        // 声明式验证：直接使用别人定义好的验证规则进行验证
                        { required: true,whitespace:true,message: '用户名必须输入' },
                        { min: 4, message: '用户名至少4位' },
                        { max: 12, message: '用户名最多12位' },
                        {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文、数字或下划线组成'}
                    ]}>
                      <Input prefix={<UserOutlined className="site-form-item-icon"/> } placeholder="用户名" />
                    </Form.Item>
                    <Form.Item  name="password"  rules={[
                        { validator:this.validatorPwd }]}>
                      <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="密码"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-form-button">
                        登陆
                      </Button>
                    </Form.Item>
                  </Form>
                </section>
            </div>
        )
    }
}

/* 
1、前台表单验证
2、收集表单输入数据
*/ 