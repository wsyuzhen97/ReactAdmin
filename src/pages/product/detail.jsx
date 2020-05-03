import React,{Component} from 'react';
import {Card,List} from 'antd'
import { LeftOutlined  } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {BASE_IMG_UTL} from '../../utils/constants';
import {reqCategory} from '../../api'
const {Item} = List
// Product添加和更新的子路由组件
// 商品分类
export default class ProductDetail extends Component{
    state={
        cName1:'', //一级分类名称
        cName2:'' //二级分类名称
    }
    componentDidMount = async ()=>{
        // 得到当前商品的分类id
        const{pCategoryId,categoryId} = this.props.location.state;
        if(pCategoryId === "0"){
            //一级分类
           const result = await reqCategory(categoryId)
           this.setState({
            cName1:result.data.name
           })
        }else{
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            this.setState({
                cName1:results[0].data.name,
                cName2:results[1].data.name
            })
        }
    }
    render(){
        const title = (
            <span>
                <LinkButton onClick={()=>{this.props.history.goBack()}}> <LeftOutlined /></LinkButton>
                <span>商品详情</span>
            </span>
        )
        const {name,imgs,detail,desc,price} = this.props.location.state;
        const {cName1,cName2} =this.state;
        return(
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类：</span>
                        <span>{cName1}{cName2?'-->'+cName2:''}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片：</span>
                        <span>
                            {imgs.map(img => (
                                <img key={img} className="product-img" src={BASE_IMG_UTL+img}  alt=""/>
                            ))}
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}