import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form,  Input, Select } from 'antd';
const {Option} = Select
// 添加用户/修改用户的form
export default class UserForm extends PureComponent {
    formRef = React.createRef(); //ref形式获取form
    state = {
        form:[]
    }
    static propTypes = {
        setForm:PropTypes.func.isRequired,
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }
    getForm = ()=> this.state.form

    formChange = (changedValues, allFields) =>{
        this.setState({
            form:allFields
        })
    }
    UNSAFE_componentWillMount =() =>{
        this.props.setForm(this.formRef)
    }
    render() {
        const {roles} = this.props;
        const user = this.props.user;
        const formItemLayout =  {
            labelCol:{span: 4} ,
            wrapperCol: { span: 16 }
        }
        return (
            <Form className="product" onValuesChange={this.formChange} {...formItemLayout} key={user._id} initialValues={{
                username:user.username,
                password:user.password,
                phone:user.phone,
                email:user.email,
                role_id:user.role_id,
              }} ref={this.formRef}>
                <Form.Item label="用户名" name="username" rules={[{ required: true, message: '用户名称必须输入！' }]}  
               >
                    <Input placeholder="请输入用户名称" />
                </Form.Item>
                {
                    user._id ? null : 
                    <Form.Item label="密码" name="password" rules={[{ required: true, message: '用户密码必须输入！' }]}>
                        <Input type="password" placeholder="请输入密码" />
                    </Form.Item>
                }
                
                <Form.Item label="手机号" name="phone">
                    <Input placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item label="邮箱" name="email">
                    <Input type="email" placeholder="请输入邮箱" />
                </Form.Item>
                <Form.Item label="角色" name="role_id">
                    <Select>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}