import React,{Component} from 'react';
import {Card,Select,Input,Button,Table, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api';
import {PAGE_SIZE} from '../../utils/constants'
const { Option } = Select;
// Product默认子路由组件
// 商品分类
export default class ProductHome extends Component{
    state={
        loading:false, //是否正在加载中
        total:0, //商品总数量
        products:[], //商品的数组
        searchType:'productName', //根据哪个字段搜素
        searchValue:''
        // {"status":1,"_id":"5ca9e05db49ef916541160cd","name":"联想ThinkPad 翼480","price":66000,"desc":"哈哈哈"},{"status":0,"_id":"5ca9e05db49ef916541160ce","name":"华硕 飞行堡","price":7666,"desc":"哈哈哈er"}
    }
    // 初始化table 列的数组
    initColums =()=>{
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name'
            },
            {
              title: '商品描述',
              dataIndex: 'desc'
            },
            {
            title: '价格',
            dataIndex:'price', 
            render:price => '￥'+price //当前指定了 对应属性，传入的是对应的属性值
            },
            {
                title: '状态',
                width:100,
                render: (product) =>{
                    const {status,_id} = product
                    return(
                        <span>
                            <Button type="primary" onClick={()=>{
                                this.updateStatus(_id,status ===1?2:1)
                            }}>{status===1?'下架':'上架'}</Button>
                            <span>{status===1?'在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width:120,
                render: (product) =>{
                    return(
                        <span>
                            <LinkButton onClick={()=>{this.props.history.push('/product/detail',product)}}>详情</LinkButton>
                            <LinkButton onClick={()=>{this.props.history.push('/product/addupdate',product)}}>修改</LinkButton>
                        </span>
                    )
                }
            },
          ];
    }

    // 获取指定页码的列表数据显示
    getProducts=async (pageNum)=>{
        this.pageNum = pageNum //保存当前页
        this.setState({
            loading:true
        })
        const {searchValue,searchType} = this.state;
        //如果 搜索关键字有值 说明要进行搜索分页
        let result;
        if(searchValue){
          result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchValue,searchType})
        }else{
          result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({
            loading:false
        })
        if(result.status ===0){
            // 取出分页数据，更新状态，显示分页列表
           const{total,list} = result.data
           this.setState({
            total,
            products:list
           })
        }
    }
    updateStatus = async (productId,status) =>{
       const result = await reqUpdateStatus(productId,status)
       if(result.status === 0){
           message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount(){
        this.initColums()
    }
    componentDidMount(){
        this.getProducts(1)
    }
    render(){
        // 取出状态数据
        const {products,total,loading,searchType} = this.state;
        const title =(
            <span>
                <Select value={searchType} style = {{width:150}} onChange={value=>this.setState({searchType:value})}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder="关键字" style = {{width:150,margin:'0 15px'}} onChange={e=>this.setState({searchValue:e.target.value})}/>
                <Button type="primary" onClick={()=>{this.getProducts(1)}}>搜索</Button>
            </span>

        )

        const extra =(
            <Button type="primary" onClick={()=>this.props.history.push('/product/addupdate')}><PlusOutlined />添加商品</Button>
        )
        return(
            <Card title={title} extra={extra}>
                <Table bordered rowKey='_id' dataSource={products} columns={this.columns} loading={loading} pagination={{
                    current:this.pageNum,
                    total,
                    defaultPageSize:PAGE_SIZE,
                    showQuickJumper:true,
                    onChange:this.getProducts
                }} />
            </Card>
        )
    }
}