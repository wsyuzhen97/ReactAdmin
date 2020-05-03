import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form,  Input ,Tree} from 'antd';
import menuList from '../../config/menuConfig'
// 添加分类的form
export default class AuthForm extends PureComponent {
    constructor (props){
        super(props)
        const {menus} = this.props.role;
        this.state ={
            checkedKeys:menus
        }
    }
    static propTypes = {
        role: PropTypes.object
    }
    handleAdd = (e)=>{
        this.setState({
            inputValue:e.target.value
        },()=>{
            this.props.getInput(this.state.inputValue)
        })
    }
    onCheck = (checkedKeys)=>{
        this.setState({
            checkedKeys
        })
    }
    // 用于父组件调用的方法
    getMenus=()=> this.state.checkedKeys
    // 根据新传入的role来更新checkedKeys状态 组件在render前接收到新的属性自动调用
    UNSAFE_componentWillReceiveProps = (nextProps)=>{
        console.log('willreceive',nextProps)
        this.setState({
            checkedKeys:nextProps.role.menus
        })
    }
    render() {
        const {role} = this.props;
        const{checkedKeys} = this.state;
        const treeData = [{title: '平台权限',
        key: 'all',
        children: [...menuList]}]
        return (
            <div>
                <Form.Item label="角色名称" labelCol={{span: 4}} 
                wrapperCol= {{ span: 16 }}>
                    <Input value={role.name} disabled/>
                </Form.Item>
                <Tree
                    checkable
                    treeData={treeData}
                    checkedKeys={checkedKeys}
                    defaultExpandAll={true}
                    onCheck={this.onCheck}
              />
            </div>
        )
    }
}