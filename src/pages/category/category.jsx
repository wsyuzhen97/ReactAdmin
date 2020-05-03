import React, { Component } from 'react';
import { Card, Table, Button, message, Modal } from 'antd';
import { PlusOutlined,RightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api';
import  AddForm from './add-form';
import  UpdateForm from './update-form';
// 分类
export default class Category extends Component {
   
    state = {
        loading:false, //是否正在获取数据中
        categorys: [], //一级分类列表
        parentId:"0", //当前需要显示的分类列表的父分类Id
        subCategorys:[], //子分类列表
        parentName:'',//当前需要显示的分类列表的父分类名称
        showStatus: 0 //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    }

    // 初始化table所有列数组
    initColums = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',//显示数据对应的属性名
                key: '_id',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => <span><LinkButton onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButton>
                {/*如何向事件回调函数传递参数：先定义一个匿名函数，在函数调用处理的函数并传入数据*/ }
                {this.state.parentId === "0"? <LinkButton onClick={ ()=>this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
                </span>
                
            }
        ];
    }
    // 异步获取一级/二级列表显示
    // parentId 若未指定根据parentId请求若指定了则根据指定的请求
    getCategorys = async (parentId) => {
        // 在发请求前，显示loading
        this.setState({loading:true})
        parentId = parentId || this.state.parentId
        // 发异步ajax请求获取数据
        const result = await reqCategorys(parentId)
        // 在请求完成后,隐藏loading
        this.setState({loading:false})
        if (result.status === 0) {
            //取出分类数组（可能一级也可能二级）
            const categorys = result.data;
            if(parentId === "0"){
                // 更新一级分类状态
                this.setState({
                    categorys
                })
            }else{
                // 更新二级分类状态
                this.setState({
                    subCategorys:categorys
                })
            }
            
        } else {
            message.error('获取分类列表失败')
        }
    }
    // 显示一级列表
    showCategorys = () =>{
        // 更新为显示一级列表的状态 这里没有调用接口！而是用的第一次调用的数据
        this.setState({
            parentId:"0",
            parentName:'',
            subCategorys:[]
        })
    }
    // 显示一级指定的二级分类列表
    showSubCategorys = (category) =>{
        // 更新状态
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{ //在状态更新且重新render()后执行 setState是异步更新
            // console.log('parentId',this.state.parentId)
            // 获取二级分类列表
            this.getCategorys()
        })
    }

    // 响应点击取消：隐藏确认框
    handleCancel = () => {
        //  隐藏form
        this.setState({
            showStatus: 0
        })
    }
    // 显示添加确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    // 添加分类
    addCategory = async() => {
        if(this.addId){
            this.setState({
                showStatus:0
            })
            // 收集数据并提交请求
            const categoryName = this.addInput;
            const parentId = this.addId;
            const result = await reqAddCategory(categoryName,parentId);
            if(result.status === 0){
                if(parentId === this.state.parentId) {
                    // 重新获取当前分类列表显示 添加的分类就是当前分类
                    this.getCategorys()
                }else if(parentId === "0"){
                    // 在二级分类列表下添加一级分类，重新获取一级列表，但不显示
                    this.getCategorys("0")
                }
            }else{
                message.error(result.msg)
            }
        }else{
            message.warning('您还未输入分类名称')
        }
        
    }
    // 显示更新确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category;
        // 更新状态
        this.setState({
            showStatus: 2
        })

    }
    // 更新分类
    updateCategory = async () => {
        if(this.input){
            // 隐藏确认框
            this.setState({
                showStatus: 0
            })
            // 准备数据
            const categoryId = this.category._id;
            const categoryName = this.input;
            // 2.发请求更新分类
            const result =  await reqUpdateCategory(categoryName,categoryId)
            if(result.status === 0){
                // 3.重新显示列表
                this.getCategorys()
            }else{
                message.error(result.msg)
            }
        }else{
            message.warning('您还未输入分类名称')
        }
        
        
    }
    // 为第一次render准备数据
    UNSAFE_componentWillMount = () => {
        this.initColums()
    }
    // 执行异步 发异步请求
    componentDidMount = () => {
        // 获取一级
        this.getCategorys()
    }
    render() {
        const { loading,categorys,subCategorys,parentId,parentName, showStatus } = this.state;
        // 读取指定分类
        const category = this.category || {name:"",_id:""} //如果还没有指定一个空对象
        // card的左侧标题
        const title = parentId=== "0"? '一级分类列表':(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <RightOutlined style={{marginRight:5}} />
                <span>{parentName}</span>
            </span>
        )
        // Card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )
        return (
            <Card className="category" title={title} extra={extra}>
                <Table dataSource={parentId==="0"?categorys:subCategorys} loading={loading} columns={this.columns} bordered rowKey="_id" pagination={{defaultPageSize:5}}/>
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                 <AddForm categorys={categorys} parentId={parentId} getInput={input => this.addInput = input}
                 getId={value => this.addId = value}
                 /> 
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} categoryId={category._id} setInput={(input)=>{this.input = input}} />
                </Modal>
            </Card>
        )
    }
}