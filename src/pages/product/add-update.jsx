import React,{PureComponent} from 'react';
import {Card,Form,Input,Cascader,message,Button } from 'antd';
import { LeftOutlined  } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import{reqCategorys} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import {reqAddOrUpdateProduct} from '../../api'
const {Item} = Form;
const { TextArea } = Input;

// Product添加和更新的子路由组件
// 商品分类
export default class ProductAddUpdate extends PureComponent{
    state={
        options:[]
    }
    constructor(props){
        super(props)
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    initOptions =  async (categorys) => {
        // 根据categorys 生成 options数组
        const options =  categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false, //显示箭头
        }))
        // 如果是一个二级分类商品的更新
        const{isUpdate,product} = this;
        const{pCategoryId} = product;
        if(isUpdate && pCategoryId !== '0'){
            // 获取对应的二级分类列表
           const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true //二级分类必定没有箭头啦
            }))
            // // 找到当前商品对应的一级option对象
            const targetOptions = options.find(options => options.value === pCategoryId)
            targetOptions.children = childOptions;
        }

        // 更新 options
        this.setState({options})
    }
    // 获取一级/二级分类列表 并显示
    getCategorys = async (parentId) =>{
      const result = await reqCategorys(parentId)
      if(result.status === 0){
          const categorys = result.data;
          //如果是一级分类列表
          if(parentId === "0"){
            this.initOptions(categorys)
          }else{ //二级列表
            return categorys //返回二级列表 ==> 当前async函数返回的promise就会成功且value为categorys
          }
      }
    }

    // 用于加载下一级列表的回调
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0];
        // 显示loading
        targetOption.loading = true;
        // 根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 模拟请求异步获取二级列表数据并更新
        targetOption.loading = false;
        if(subCategorys && subCategorys.length > 0){ //有二级分类
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c =>({
                value: c._id,
                label: c.name,
                isLeaf: true //二级分类必定没有箭头啦
            }))
            //关联到当前option上
            targetOption.children = childOptions
        }else{ //当前选中的分类没有二级分类
            targetOption.isLeaf = true; //二级查询了才知道一级没有箭头
        }
        //更新options状态
        this.setState({
            options: [...this.state.options],
        });
      };
    // 验证价格的验证函数
    validatorPrice = (rule, value)=>{
        return new Promise((resolve,reject) =>{
            if(value * 1 >0){
                resolve()
            }else{
                reject('价格必须大于0')
            }
        })
    }
    // 表单提交
    submitForm = async (values)=>{
        // 收集数据
        const {name,desc,price,categoryIds} = values;
        let pCategoryId,categoryId
        if(categoryIds.length === 1){
            pCategoryId = '0';
            categoryId = categoryIds[0]
        }else{
            pCategoryId = categoryIds[0];
            categoryId = categoryIds[1];
        }
        const imgs = this.pw.current.getImgs();
        const detail = this.editor.current.getDetail();
        const product = {
            name,desc,price,pCategoryId,categoryId,imgs,detail
        }
        // 如果是更新 需要添加_id
        if(this.isUpdate){
            product._id = this.product._id;
        }
        // 调用接口 去添加 / 更新
        const result = await reqAddOrUpdateProduct(product)
        // 根据结果提示
        if(result.status === 0){
            message.success(`${this.isUpdate?'更新':'添加'}商品成功！`)
            this.props.history.goBack()
        }else{
            message.error(`${this.isUpdate?'更新':'添加'}商品失败！`)
        }
    }

    componentDidMount = ()=>{
        this.getCategorys('0')
    }

    UNSAFE_componentWillMount(){
        //取出携带的state
        const product = this.props.location.state; //接收修改页面传过来的参
        this.isUpdate = !!product //转为布尔 有值true 无值false
        this.product = product || {}
    }

    render(){
        const {isUpdate,product} = this;
        const {pCategoryId,categoryId,imgs,detail} = product;
        // 用来接收级联分类ID的数组
        const categoryIds = [];
        if(isUpdate){
            //商品是一个一级分类商品
            if(pCategoryId === "0"){
                categoryIds.push(pCategoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const title = (
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <LeftOutlined  style={{fontSize:20}} />
                </LinkButton>
                <span>{isUpdate?'修改商品':'添加商品'}</span>
            </span>
        )
        // 指定Item布局的配置对象
        const layout = {
            labelCol: { span: 2 }, //左侧label的宽度
            wrapperCol: { span: 8 }, //右侧内容的宽度
          };

          const onFinish = values => {
            //   提交表单方法
            this.submitForm(values)
          };
          const {options} = this.state;
        return(
            <Card title={title}>
                <Form {...layout} onFinish={onFinish} initialValues={{
                    name: product.name,
                    desc: product.desc,
                    price:product.price,
                    categoryIds:categoryIds
                  }}>
                    <Item label="商品名称" name="name" rules={[{ required: true, message: '必须输入商品名称!' }]}>
                        <Input placeholder="请输入商品名称" />
                    </Item>
                    <Item label="商品描述" name="desc" rules={[{ required: true, message: '必须输入商品描述!' }]}>
                        <TextArea placeholder="请输入商品描述" autoSize={{minRows:2,maxRows:6}} />
                    </Item>
                    <Item name="price" label="商品价格" rules={[{ required: true, message: '必须输入商品描述!' },{validator:this.validatorPrice}]}>
                        <Input type="number" placeholder="请输入商品价格" addonAfter="元"/>
                    </Item>
                    <Item name="categoryIds" label="商品分类" rules={[{ required: true, message: '必须选择商品分类!' }]}>
                        <Cascader
                        placeholder="请指定商品分类"
                        options={options} //需要显示的列表数据
                        loadData={this.loadData} //选择某个列表项，加载下一级列表的监听回调
                        />
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label="商品详情" labelCol={{span: 2}} //左侧label的宽度
                    wrapperCol= {{ span: 20 }}>
                    <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}