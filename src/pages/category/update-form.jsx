import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Form,  Input } from 'antd';
// 更新分类form
export default class UpdateForm extends Component {
    state={
        inputValue:""
    }
    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setInput:PropTypes.func.isRequired,
        categoryId:PropTypes.string.isRequired
    }
    handleChange = (e) =>{
        this.setState({
            inputValue:e.target.value
        },()=>{
            this.props.setInput(this.state.inputValue)
        })
        
    }
    render() {
        const {categoryId,categoryName} = this.props;
        return (
            <Form key={categoryId} initialValues={{
                updateInfo:categoryName,
              }}>
                <Form.Item name="updateInfo" rules={[{ required: true, message: '分类名称必须输入！' }]}>
                    <Input onChange={this.handleChange.bind(this)} placeholder="请输入分类名称" />
                </Form.Item>
            </Form>
        )
    }
}