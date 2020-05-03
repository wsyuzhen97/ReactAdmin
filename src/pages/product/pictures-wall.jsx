import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from '../../api'
import PropTypes from 'prop-types'
import {BASE_IMG_UTL} from '../../utils/constants'
// 用于图片上传的组件

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs:PropTypes.array
  }
  
  constructor(props){
      super(props)
      let fileList = []
      const {imgs} = this.props
      if(imgs && imgs.length>0){
        fileList = imgs.map((img,index) => ({
            uid:-index,
            name:img, //图片文件名
            status:'done',
            url:BASE_IMG_UTL + img
        }))
      }
    //   初始化状态
    this.state = {
        previewVisible: false, //表示是否显示大图预览
        previewImage: '', //大图的url
        previewTitle: '',
        fileList //所有已上传图片的数组
    }
  }
  // 获取所有已上传图片文件名的数组
  getImgs = () =>{
      return this.state.fileList.map(file => file.name)
  }

//   隐藏modal
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
//   file：当前操作的图片文件（上传/删除）
//   fileList :所有已上传的数组
  handleChange = async ({ file,fileList }) => {
    //   console.log('handleChange()',file.status,file)
        // 一旦上传成功。将当前上传的file信息修正(name,url)
    if(file.status === 'done'){
        const result = file.response //服务器返回的{status:0,data:{name:'xxx.jpg',url:'图片地址'}}
        if(result.status ===0 ){
            message.success('上传图片成功')
            const {name,url} = result.data;
            file = fileList[fileList.length - 1]
            file.name = name;
            file.url = url
        }else{
            message.error('上传图片失败')
        }
    }else if(file.status === 'removed'){ //删除图片
       const result = await reqDeleteImg(file.name) //这里不用fileList是因为那是删除了以后的数组
       if(result.status === 0){
            message.success('删除图片成功')
       }else{
            message.error('删除图片失败')
       }
    }
      //   在操作过程中更新fileList状态
      this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" //上传图片的接口地址
          listType="picture-card" //卡片样式
          fileList={fileList}  //所有已上传文件的列表
          accept="image/*" //只接受图片格式
          name="image" //请求参数名
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}