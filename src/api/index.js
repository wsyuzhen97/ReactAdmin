/*
要求：能根据接口文档定义接口请求函数
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/ 
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'
//登陆
// export function reqLogin(username,password){
//    return  ajax('/login',{username,password},'POST')
// }
const BASE = ""
export const reqLogin = (username,password) => ajax(BASE+'/login',{username,password},'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax('/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = (categoryName,parentId) => ajax('/manage/category/add',{categoryName,parentId},'POST')
// 更新分类
export const reqUpdateCategory = (categoryName,categoryId) => ajax('/manage/category/update',{categoryName,categoryId},'POST')
// 根据分类id获取分类名称
export const reqCategory = (categoryId) => ajax('/manage/category/info',{categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum,pageSize)=>ajax('/manage/product/list',{pageNum,pageSize})
// 更新商品状态（上架下架） 1在售  2 下架
export const reqUpdateStatus = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')

// 搜索产品分页列表 搜索类型 productName/productDesc 传给searchType
export const reqSearchProducts = ({pageNum,pageSize,searchValue,searchType})=>ajax('/manage/product/search',{pageNum,pageSize,[searchType]:searchValue})
// 图片删除接口
export const reqDeleteImg = (name)=>ajax('/manage/img/delete',{name},'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product)=>ajax('/manage/product/' + (product._id?'update':'add'),product,'POST')
// 获取所有角色的列表
export const reqRoles = ()=>ajax('/manage/role/list')
// 添加角色
export const reqAddRoles = (roleName)=>ajax('/manage/role/add',{roleName},'POST')
// 更新角色
export const reqUpdateRoles = (role)=>ajax('/manage/role/update',role,'POST')

// 获取所有用户的列表
export const reqUsers = ()=>ajax('/manage/user/list')
// 删除用户
export const reqDeleteUsers = (userId)=>ajax('/manage/user/delete',{userId},'POST')
// 添加用户
export const reqAddOrUpdateUser = (user)=>ajax('/manage/user/'+(user._id?'update':'add'),user,'POST')
// json请求的接口请求函数

export const reqWeather = (city) =>{
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    return new Promise((resolve,reject) =>{
        // 发送jsonp请求
        jsonp(url,{},(err,data)=>{
            // 如果成功了
            if(!err || data.status === 'success'){
                // 取出需要的数据
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else{
            // 如果失败了
                message.error('获取天气信息失败')
            }
        })
    })
}