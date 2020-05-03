import React,{Component} from 'react';
import {Card,Button,Table, Modal, message} from 'antd';
import {reqRoles,reqAddRoles,reqUpdateRoles} from '../../api';
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils';
import {formateDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils.js'
// 角色分类
export default class Role extends Component{
    constructor(props){
        super(props)
        this.auth = React.createRef()
    }

    state ={
        roles:[], //所有角色的列表
        role:{}, //选中的role
        isShowAdd:false,
        isShowAuth:false //是否显示设置权限界面
    }
    initColum = ()=>{
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time)=> formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render: formateDate //等同上面写法
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            },
        ]
    }
    getRoles= async ()=>{
        const result = await reqRoles()
        if(result.status === 0){
            const roles = result.data;
            this.setState({
                roles
            })
        }
    }
    onRow=(role)=>{
        return{
            onClick:event =>{
               this.setState({
                role
               })
            }
        }
    }
    addRole = async () =>{
        this.setState({
            isShowAdd:false
        })
        const result = await reqAddRoles(this.input)
        if(result.status === 0){
            message.success('添加角色成功')
            // this.getRoles()
            const role = result.data;
            this.setState(state =>({
                roles:[...state.roles,role]
            }))
        }else{
            message.error('添加角色失败')
        }
    }
    // 更新角色
    updateRole= async ()=>{
        this.setState({
            isShowAuth:false
        })
        const role = this.state.role;
        // 得到最新的menus
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        role.auth_name = memoryUtils.user.username;
        const result = await reqUpdateRoles(role)
        if(result.status === 0){
            // 如果当前更新的是自己角色的权限,强制退出
            if(role._id === memoryUtils.user.role_id){
                message.warning('当前用户权限修改了，请重新登录')
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            }else{
                message.success('设置角色权限成功！')
                this.setState({
                    roles:[...this.state.roles]
                })
            }
            
        }else{
            message.error('设置角色权限失败！')
        }
    }
    componentDidMount=()=>{
        this.getRoles()
    }
    UNSAFE_componentWillMount = ()=>{
        this.initColum()
    }
    render(){
        const {roles,role,isShowAdd,isShowAuth} = this.state;
        const title = (
            <span>
            <Button type="primary" onClick={()=>{this.setState({isShowAdd:true})}}>创建角色</Button> &nbsp;&nbsp;
            <Button type="primary" onClick={()=>{this.setState({isShowAuth:true})}} disabled={!role._id}>设置角色权限</Button>
            </span>
        )
        return(
            <Card title={title}>
                <Table  
                dataSource={roles} 
                // loading={loading} 
                columns={this.columns}
                bordered 
                rowKey="_id"
                rowSelection={{type:'radio',selectedRowKeys:[role._id],onSelect:(role)=>{this.setState({role})}}}
                onRow={this.onRow}
                pagination={{defaultPageSize:5,showQuickJumper:true}} />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>{this.setState({isShowAdd:false})}}
                >
                 <AddForm getInput={(input)=> this.input = input}
                 /> 
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>{this.setState({isShowAuth:false})}}
                >
                <AuthForm role={role} ref={this.auth}/> 
                </Modal>
            </Card>
        )
    }
}