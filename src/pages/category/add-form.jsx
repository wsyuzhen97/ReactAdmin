import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input } from 'antd';
const { Option } = Select;

// 添加分类的form
export default class AddForm extends Component {
    state = {
        inputValue:null,
        inputId:null
    }
    static propTypes = {
        categorys:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        getInput:PropTypes.func.isRequired,
        getId:PropTypes.func.isRequired
    }
    handleAdd = (e)=>{
        this.setState({
            inputValue:e.target.value
        },()=>{
            this.props.getInput(this.state.inputValue)
        })
    }
    IdAdd = (value) =>{
        this.setState({
            inputId:value
        },()=>{
            this.props.getId(this.state.inputId)
        })
    }
    render() {
        const {categorys,parentId} = this.props;
        console.log(parentId)
        return (
            <Form className="product" initialValues={{
                categorySelect:parentId,
                addInfo: ""
              }}>
                <Form.Item name="categorySelect" >
                    <Select key={parentId} onChange={(value)=>{this.IdAdd(value)}}>
                        <Option value="0" key="0">一级分类</Option>
                        {
                            categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="addInfo" rules={[{ required: true, message: '分类名称必须输入！' }]}>
                    <Input key={parentId} onChange={this.handleAdd.bind(this)} placeholder="请输入分类名称" />
                </Form.Item>
            </Form>
        )
    }
}