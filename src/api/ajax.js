/*
能发送ajax函数模块
封装axios库
函数的返回值是promise对象
1、优化：统一处理请求异常
*/ 
import axios from 'axios';
import { message } from 'antd';

export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject) => {
        let promise;
        //执行异步ajax请求
        if(type === 'GET'){
            promise = axios.get(url,{
                params:data
            })
        }else{
            promise = axios.post(url,data)
        }
        promise.then(response =>{  // 如果成功了 调用resolve(value)
            resolve(response.data)
        }).catch(err =>{ // 如果失败了 不调用reject(reason)，二嫂提示异常信息
            message.error('请求出错了：'+err.message);
        })
       
        
    })

    
}