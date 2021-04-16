<template>
    <profile-card>
        <div slot="tip">发布动态</div>
        <div class="main" slot="main">
            <el-form :model="actionForm" :rules="actionFormRules" ref="actionForm" label-width="100px" enctype="multipart/form-data">
                <el-form-item label="动态标题" prop="blog_title">
                    <el-input v-model="actionForm.blog_title"></el-input>
                </el-form-item>
                <el-form-item label="动态描述" prop="blog_content">
                    <el-input type="textarea" v-model="actionForm.blog_content"></el-input>
                </el-form-item>
                <el-form-item label="照片列表" prop="photos">
                    <el-upload
                        action="#"
                        accept="image/*"
                        multiple
                        list-type="picture-card"
                        :limit="9"
                        :on-change="handleChange"
                        :auto-upload="false"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <el-button type="danger" @click="handleUpload" size="mini">上传以上选中文件</el-button>
                </el-form-item>
                <el-form-item class="time" label="发布时间" prop="time">
                    <span>{{ time }}</span>
                </el-form-item>
                <el-form-item class="time">
                    <el-button type="primary" @click="submitForm('actionForm')">发布</el-button>
                    <el-button @click="resetForm('actionForm')">重置文本</el-button>
                </el-form-item>
            </el-form>
        </div>
    </profile-card>
</template>
<script>
    import ProfileCard from './ProfileCard'
    import { dateFormat } from '../../../common/utils/dateFormat'
    import { baseUrl } from '../../../common/utils/BaseUrl'
    import { request } from '../../../network/request'
    export default {
        name: 'ProfileAction',
        data() {
            return {
                // 1.发布动态表单数据
                actionForm: {
                    blog_title: '',
                    blog_content: '',
                    blog_images: [],
                },
                // 2.发布动态表单验证规则
                actionFormRules: {
                    blog_title: [
                        { required: true, message: '请输入动态标题', trigger: 'blur' },
                        { max: 15, message: '不能多于 15 个字符', trigger: 'blur' }
                    ],
                    blog_content: [
                        { required: true, message: '请输入动态描述', trigger: 'blur' }
                    ]
                },
                // 3.发布的时间
                time: '',
                // 4.照片的上传
                dialogImageUrl: '',
                dialogVisible: false,
                // 5.保存上传的文件
                fileList: [],
            }
        },
        components: {
            ProfileCard
        },
        computed: {
            // 1.返回baseUrl
            returnBaseUrl() {
                return baseUrl
            }
        },
        methods: {
            // 提交表单
            submitForm(formName) {
                // 验证整个表单是否通过验证
                this.$refs[formName].validate(async valid => {
                    if (valid) { // 允许发布
                        const { data: res } = await request({
                            url: '/releaseDynamic',
                            method: 'post',
                            data: this.actionForm
                        })
                        if (res.status !== 200) return this.$message.error('网络错误，发布失败')
                        this.$message.success({
                            message: '发布成功即将跳转至动态页',
                            onClose: () => this.$router.replace('/dynamic')
                        })
                    } else {
                        this.$message.error('验证未通过')
                        return false;
                    }
                })
            },
            // 重置表单文本
            resetForm(formName) {
                this.$refs[formName].resetFields()
            },
            // 上传文件
            async handleUpload(e) {
                if (this.fileList.length === 0) {
                    return this.$message.error('你还没有要上传的图片，快去添加吧')
                }
                let formData = new FormData()
                for (let item of this.fileList) {
                    formData.append('imgs', item.raw)
                }
                const { data: res } = await request({
                    url: '/upBlogImg',
                    method: 'post',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData
                })
                if (res.status !== 200) return this.$message.error('网络错误')
                // 1.提示上传成功
                this.$message.success('上传成功')
                // 2.将返回的paths数组中的 \ 转为 /
                const result = res.result.map(item => baseUrl + '/' + item.replace(/\\/g, '/'))
                this.actionForm.blog_images.push(...result)
            },
            // 文件状态改变的钩子 --- 添加文件：将添加的文件加入到文件数组中
            handleChange(file) {
                const { name, raw } = file
                this.fileList.push({ name, raw })
            },
            // 移除文件钩子
            handleRemove(file, fileList) {
                this.fileList = this.fileList.filter(item => item.name !== file.name)
            },
            // 添加文件显示钩子 --- 将添加的图片立即显示出来
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // 发布动态时间
            releaseTime() {
                this.time = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
        },
        created() {
            // 1.更新发布的时间
            setInterval(() => {
                this.releaseTime()
            }, 1000)
        }
    }
</script>
<style scoped>
    .el-form {
        margin-top: 1%;
        padding: 20px;
        overflow: auto;
        height: 460px;
    }
    .el-form::-webkit-scrollbar {
        width: 5px;
    }
    .el-form::-webkit-scrollbar-thumb, .el-form::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0,0,0,.2);
        background-color: rgba(0,0,0,.2);
    }
    .time {
        margin-top: -2%;
    }
</style>