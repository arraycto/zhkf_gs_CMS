import API from '@/constant/api';
import {Modal} from "ant-design-vue";
import { judgeSensitiveWord  } from "@/utils/common.ts";
export const mixin = {
    data() {
        return {
            uploadImgUrl: "/gsznkf/apibk" + API.port9334.UploadImg,
            uploadVioUrl: "/gsznkf/apibk" + API.port9334.uploadVio,
            num: 0
        }
    },
    methods: {
        // 上传图片前
        beforeUploadImg(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.fileList = [];
                this.picAnswer = "";
                this.$emit('uploadAnswer',"",this.value);
                this.validateText(false);
                this.$notification.open({
                    message: '图片上传失败!',
                    description:
                      '失败原因: 暂不支持该格式,请选择JPG/PNG格式重新上传',
                    icon: <jt-icon type="close-circle" style="color:red"/>,
                });
                this.isErrorImg = true
                this.$nextTick(()=>{
                    document.querySelector('#' + 'textarea' + this.value.key + ' .ant-upload-list-picture-card-container').style.display = 'none'
                })
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.fileList = [];
                this.picAnswer = "";
                this.$emit('uploadAnswer',"",this.value);
                this.validateText(false);
                this.$notification.open({
                    message: '图片上传失败!',
                    description:
                      '失败原因: 图片大小超过5M,请重新选择上传',
                    icon: <jt-icon type="close-circle" style="color:red"/>,
                });
                this.isErrorImg = true
                this.$nextTick(()=>{
                    document.querySelector('#' + 'textarea' + this.value.key + ' .ant-upload-list-picture-card-container').style.display = 'none'
                })
            }
            const imgSensitiveWord = judgeSensitiveWord(file.name.split(".")[0]);
            if (!imgSensitiveWord.detectedResult) {
                this.fileList = [];
                this.picAnswer = "";
                this.$emit('uploadAnswer',"",this.value);
                this.validateText(false);
                this.$notification.open({
                    message: '图片上传失败!',
                    description:
                      '失败原因: 图片名包含敏感词',
                    icon: <jt-icon type="close-circle" style="color:red"/>,
                });
                this.isErrorImg = true
                this.$nextTick(()=>{
                    document.querySelector('#' + 'textarea' + this.value.key + ' .ant-upload-list-picture-card-container').style.display = 'none'
                })
            }
            return isJpgOrPng && isLt5M && imgSensitiveWord.detectedResult;
        },
        imgReject() {
            this.fileList = [];
            this.picAnswer = "";
            this.$emit('uploadAnswer',"",this.value);
            this.validateText(false);
            this.$notification.open({
                message: '图片上传失败!',
                description:
                  '失败原因: 暂不支持该格式,请选择JPG/PNG格式重新上传',
                icon: <jt-icon type="close-circle" style="color:red"/>,
            });
            this.isErrorImg = true
            this.$nextTick(()=>{
                const isCard = document.querySelector('.ant-upload-list-picture-card-container')
                if(isCard) {
                    isCard.style.display = 'none'
                }
            })
        },
        closeError() {
            if (this.tabType == 'pic') {
                this.isErrorImg = false
                this.fileList = []
            }else if (this.tabType == 'vio') {
                this.isErrorVio = false
                this.fileListTwo = []
            }
        },
        handleCancel() {
            this.previewVisible = false;
        },
        // 点击文件链接或预览图标时的回调
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await this.getBase64(file.originFileObj);
            }
            this.previewImage = file.url || file.preview;
            this.$emit("setPreviewImage",this.previewImage);
            // this.previewVisible = true;
            this.$emit("setModal",true)
        },
        getBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        },
        //上传图片end
        // 上传图片/视频 
        handleChange({file,fileList,value}) {
            this.vioUploadStatus = file.status;
            if (this.tabType == 'pic') {
                this.fileList=fileList.slice(-1);
            }else if (this.tabType == 'vio') {
                this.num++;
                this.fileListTwo = JSON.parse(JSON.stringify(fileList));
                const a = `
                    <div style="text-align:center;margin-top:40px" class="uploading">
                    <div class="iconfont iconfile-video-fill" style="color:#accaff;font-size:40px;margin-top:40px"></div>
                    <div class="txtVioTop">${this.fileNameVio}</div>
                    <div class="txtVipBto">${this.fileSizeVio}MB</div>
                    </div>
                    `
                if (document.querySelector( '#' + 'textarea' + value.key + ' .ant-upload-list-item')) {
                    this.$nextTick(()=>{
                        if (this.num <= 2) {
                            document.querySelector('#' + 'textarea' + value.key + ' .ant-upload-list-item').insertAdjacentHTML('afterbegin',a);
                        }
                    })
                }
            }
            if (file.status && file.status == 'error' && this.tabType == 'pic') {
                this.isErrorImg = true;
                this.validateText(false);
                this.$nextTick(()=>{
                    // document.querySelector('.ant-upload-list-picture-card-container').style.display = 'none'
                })
                this.$notification.open({
                    message: '图片上传失败!',
                    description:
                      '失败原因: 系统繁忙请联系管理员',
                    icon: <jt-icon type="close-circle" style="color:red"/>,
                });
            }else if (file.status && file.status == 'error' && this.tabType == 'vio') {
                this.isErrorVio = true;
                this.validateText(false);
                this.$nextTick(()=>{
                    // 这里有问题点击删除后再添加视频如果失败后显示有问题
                    document.querySelector('#' + 'textarea' + value.key + ' .ant-upload-list-picture-card-container').style.display = 'none'
                })
                this.$notification.open({
                    message: '视频上传失败!',
                    description:
                      '失败原因: 系统繁忙请联系管理员',
                    icon: <jt-icon type="close-circle" style="color:red"/>,
                });
            }else if(file.status && file.status == 'done' && this.tabType == 'vio') {
                this.isSuccess = true;
                if (document.querySelector('.uploading')) {
                    // document.querySelector('.uploading').style.display = 'none';
                    // document.querySelector('.ant-upload-list-picture-card').style.display = 'block';
                }
            }
            if(file.status && file.status == 'done' && this.tabType == 'pic' && file.response) {
                this.picAnswer = '^' + file.response.result.result_success.success_list[0];
                // picAnswer关联了回显,点击其他页面时需要一个最后上传的文件
                this.lastPicAnswer = '^' + file.response.result.result_success.success_list[0];
                this.$emit('uploadAnswer',this.picAnswer,this.value);
                this.validate.answer = true;
                const picAnswerCut = this.lastPicAnswer.split("%")[0]
                this.$store.commit('guideDialog/setDelListTS',picAnswerCut);
                // 树结构新增
                value.text.valuePic = this.lastPicAnswer;
                // 删除图片需要删除content字段,这里再次上传后需要加上content字段
                this.$set(this.value.text,'clearContent',false);
                this.$set(value.text,'flag',1);
                this.validateText(true);
            }
            if (file.status && file.status == 'done' && this.tabType == 'vio' && file.response) {
                this.vioAnswer = '^' + file.response.result.result_success.success_list[0];
                this.lastVioAnswer = '^' + file.response.result.result_success.success_list[0];
                this.$emit('uploadAnswer',this.vioAnswer,this.value);
                // 上传成功后请求接口获取视频base64地址
                this.getPicOrVio1('vio',this.vioAnswer);
                this.validate.answer = true;
                const vioAnswerCut = this.lastVioAnswer.split("%")[0]
                this.$store.commit('guideDialog/setDelListTS',vioAnswerCut);
                // 树结构新增
                value.text.valueVio = this.lastVioAnswer;
                // 删除视频需要删除content字段,这里再次上传后需要加上content字段
                this.$set(this.value.text,'clearContent',false)
                this.$set(value.text,'flag',2);
                this.validateText(true);
            }
        },
        // 上传视频
        beforeUploadVio(file) {
            // 获取视频信息
            this.fileNameVio = file.name
            this.fileSizeVio = (file.size / 1024 / 1024).toFixed(2)
            // || file.type === 'video/mov' || file.type === 'video/avi'
            const vioLayout = file.type === 'video/mp4';
            if (!vioLayout) {
                this.fileListTwo = [];
                this.vioAnswer = "";
                this.$emit('uploadAnswer',"",this.value);
                this.validateText(false);
                this.$notification.open({
                    message: '视频上传失败!',
                    description:
                      '失败原因: 暂不支持该格式,请选择MP4格式重新上传',
                    icon: <jt-icon type="close-circle" style="color:red"/>,
                });
                this.isErrorVio = true
                this.$nextTick(()=>{
                    document.querySelector('.ant-upload-list-picture-card-container').style.display = 'none'
                })
            }
            const isLt100M = file.size / 1024 / 1024 < 10;
            if (!isLt100M) {
                this.fileListTwo = [];
                this.vioAnswer = "";
                this.$emit('uploadAnswer',"",this.value);
                this.validateText(false);
                this.$notification.open({
                    message: '视频上传失败!',
                    description:
                      '失败原因: 视频大小超过10M,请重新选择上传',
                    icon: <jt-icon type="close-circle" style="color:red"/>,
                });
                this.isErrorVio = true
                this.$nextTick(()=>{
                    document.querySelector('.ant-upload-list-picture-card-container').style.display = 'none'
                })
            }
            const vioSensitiveWord = judgeSensitiveWord(file.name.split(".")[0]);
            if (!vioSensitiveWord.detectedResult) {
                this.fileListTwo = [];
                this.vioAnswer = "";
                this.$emit('uploadAnswer',"",this.value);
                this.validateText(false);
                this.$notification.open({
                    message: '视频上传失败!',
                    description:
                      '失败原因: 视频名包含敏感词',
                    icon: <jt-icon type="close-circle" style="color:red"/>,
                });
                this.isErrorVio = true
                this.$nextTick(()=>{
                    document.querySelector('.ant-upload-list-picture-card-container').style.display = 'none'
                })
            }
            return vioLayout && isLt100M && vioSensitiveWord.detectedResult;
        },
        vioReject(fileList) {
            // 获取视频信息
            this.fileNameVio = fileList[0].name
            this.fileSizeVio = (fileList[0].size / 1024 / 1024).toFixed(2)
            this.fileListTwo = [];
            this.fileListTwo = [];
            this.vioAnswer = "";
            this.$emit('uploadAnswer',"",this.value);
            this.validateText(false);
            this.$notification.open({
                message: '视频上传失败!',
                description:
                  '失败原因: 暂不支持该格式,请选择MP4格式重新上传',
                icon: <jt-icon type="close-circle" style="color:red"/>,
            });
            this.isErrorVio = true
            const isCard = document.querySelector('.ant-upload-list-picture-card-container');
            this.$nextTick(()=>{
                if(isCard) {
                    isCard.style.display = 'none'
                }
            })
        },
        aginUploadClick() {
            // this.delUploadVio = true;
            const handleDelOk = this.handleDelOk
            Modal.confirm({
                icon: ()=><jt-icon type="exclamation-circle" theme="filled" style="color:red"/>,
                centered: true,
                title: <span style="font-size:14px;font-weight: 500;color: #333333;margin-left:5px">确定删除之前上传的图片吗?</span>,
                content: <div style="margin:10px 0px 0px 22px">删除后将无法恢复</div>,
                cancelText: "取消",
                okText: "确定",
                onOk() {
                    handleDelOk()
                }
            })
        },
        handleDelOk() {
            this.num = 0;
            // 校验答案是否为空
            this.validateText(false);
            // 删除数据库之前上传的视频
            const vioAnswerCut = this.vioAnswer.split("%")[0];
            this.setDelVioList(vioAnswerCut);
            // this.delUploadVio = false;
            this.fileListTwo = [];
            this.isErrorVio = false;
            this.isSuccess = false;
            this.vioAnswer = "";
            this.value.text.valueVio = "";
        },
        setDelVioList(val) {
            // this.delList.push(val)
            this.$store.commit('guideDialog/setDelList',val);
            // 删除树结构中对应的content字段
            this.$set(this.value.text,'clearContent',true)
        },
        handleDelCancel() {
            this.delUploadVio = false;
        },
        showErrorNotification(res) {
            this.showErrorNotification("删除失败！", res.errno, res.errorMsg);
        },
        setDelPicList(val) {
            // this.delList.push(val)
            this.$store.commit('guideDialog/setDelList',val)
            // 删除树结构中对应的content字段
            this.$set(this.value.text,'clearContent',true)
            this.picAnswer = "";
            this.value.text.valuePic = "";
        },
        setValidate() {
            this.validateText(false);
        },
        removePic(file) {
            const picAnswer = this.picAnswer;
            const setDelPicList = this.setDelPicList;
            const setValidate = this.setValidate;
            return new Promise((resolve) => {
                Modal.confirm({
                    icon: ()=><jt-icon type="exclamation-circle" theme="filled" style="color:red"/>,
                    centered: true,
                    title: <span style="font-size:14px;font-weight: 500;color: #333333;margin-left:5px">确定删除之前上传的图片吗?</span>,
                    content: <div style="margin:10px 0px 0px 22px">删除后将无法恢复</div>,
                    cancelText: "取消",
                    okText: "确定",
                    onOk() {
                        const picAnswerCut = picAnswer.split("%")[0];
                        setDelPicList(picAnswerCut);
                        setValidate();
                        resolve(true)
                    },
                    onCancel() {
                        resolve(false)
                    },
                });
            })
        },
        async checkVio() {
            // 请求download接口获取视频地址
            let fidVio = ""
            if(this.lastVioAnswer !== '') {
                fidVio = this.lastVioAnswer
            }else {
                fidVio = this.fidVio
            }
            if (this.editUrlVio == '') {
                await this.getPicOrVio1('vio',fidVio);
                this.$emit("setEditUrlVio",this.editUrlVio);
            }else {
                this.$emit("setEditUrlVio",this.editUrlVio);
            }
            this.vioDialog = true;
            this.$emit("setVioDialog",true);

        }
    },
}