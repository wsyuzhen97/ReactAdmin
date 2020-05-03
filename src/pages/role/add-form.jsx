import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form,  Input } from 'antd';
// 添加分类的form
export default class AddForm extends Component {
    state = {
        inputValue:null,
    }
    
    static propTypes = {
        getInput:PropTypes.func.isRequired
    }
    handleAdd = (e)=>{
        this.setState({
            inputValue:e.target.value
        },()=>{
            this.props.getInput(this.state.inputValue)
        })
    }
    render() {
        return (
            <Form className="product">
                <Form.Item label="角色名称" name="roleName" rules={[{ required: true, message: '角色名称必须输入！' }]}  labelCol={{span: 4}} 
                wrapperCol= {{ span: 16 }}>
                    <Input onChange={this.handleAdd.bind(this)} placeholder="请输入角色名称" />
                </Form.Item>
            </Form>
        )
    }
}