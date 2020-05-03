import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils';
import LinkButton from '../../components/link-button';
import { reqUsers,reqDeleteUsers, reqAddOrUpdateUser } from '../../api';
import UserForm from './user-form';
import {
    ExclamationCircleOutlined
  } from '@ant-design/icons';
// 用户分类
export default class User extends Component {
    state ={
        users:[], //所有用户列表
        roles:[], //所有角色的列表 通过user的数据提供id查询的
        isShow:false
    }
    initColumns = ()=>{
        this.columns = [
            {
                title:"用户名",
                dataIndex:'username'
            },{
                title:'邮箱',
                dataIndex:'email'
            },{
                title:'电话',
                dataIndex:'phone'
            },{
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate
            },{
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id)=> this.roleNames[role_id]
            },{
                title:'操作',
                render:(user)=>(
                    <span>
                        <LinkButton onClick={()=>{this.showUpdate(user)}}>修改</LinkButton>
                        <LinkButton onClick={()=>{this.deleteUser(user)}}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }
    // 根据role的数组,生成所有包含角色名的对象(属性名用角色id值)
    initRoleNames = (roles)=>{
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{})
        // 保存
        this.roleNames = roleNames
    }
    addUpdateUser = async ()=>{
        this.setState({
            isShow:false
        })
        const user = this.form.current.getFieldsValue()
        this.form.current.resetFields() //表单置空
        //如果是更新，需要给user指定_id属性值
        if(this.user){
            user._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(user)
        if(result.status === 0){
            message.success(this.user?'修改':'添加'+'用户成功')
            this.getUsers()
        }
    }
    getUsers = async ()=>{
        const result = await reqUsers()
        if(result.status === 0){
            const {users,roles} = result.data;
            this.initRoleNames(roles);
            this.setState({
                users,roles
            })
        }
    }
    deleteUser = (user) =>{
        Modal.confirm({
            title: '确认删除'+user.username+'吗?',
            icon: <ExclamationCircleOutlined />,
            onOk: async ()=> {
                const result = await reqDeleteUsers(user._id)
                if(result.status ===0){
                    message.success('删除用户成功')
                    this.getUsers()
                }
            }
          })
    }
    // 点击修改
    showUpdate=(user)=>{
        this.user = user //保存user
        console.log('点击修改的时候给的',this.user);
        this.setState({
            isShow:true
        })
    }
    showAdd = ()=>{
        this.user= null;
        console.log('添加框打开',this.user);
        this.setState({isShow:true})
    }
    componentDidMount = ()=>{
        this.getUsers()
    }
    UNSAFE_componentWillMount = () =>{
        this.initColumns()
    }
    render() {
        const {users,isShow,roles} = this.state;
        const user = this.user || {};
        const title = (<Button type="primary" onClick={this.showAdd}>创建用户</Button>)
        return (
            <Card title={title}>
                <Table 
                dataSource={users} 
                columns={this.columns}
                 bordered 
                 rowKey="_id"
                  pagination={{ defaultPageSize: 5 }} />
                <Modal
                    title={user._id?"修改用户":"添加用户"}
                    visible={isShow}
                    onOk={this.addUpdateUser}
                    onCancel={()=>{
                        this.form.current.resetFields()
                        console.log(this.form.current.getFieldsValue());
                        this.setState({isShow:false})
                    }}
                >
                    <UserForm setForm={form =>this.form=form}  roles={roles} user={user}/>
                </Modal>

            </Card>
        )
    }
}