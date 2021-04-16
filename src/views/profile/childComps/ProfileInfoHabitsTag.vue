<template>
    <div :class="className">
        <!-- 标题 -->
        <div class="title">{{ ing === 1 ? '正在养成的习惯，继续加油~ (最多积攒3个) ↓' : '已养成的好习惯，继续保持~ ↓' }}</div>
        
        <div class="tags_data">
            <!-- 标签数据 -->
            <div v-if="tagsData.length !== 0" class="tags">
                <el-tooltip v-for="(item, index) in tagsData" :key="index" placement="top" content="点我更换颜色">
                    <el-tag v-show="changeColorShow" :closable="ing === 1 && $route.meta.path !== '/profileVisit'"
                        @click="changeColor(item)"
                        @close="handleClose(index)"
                        :style="{ backgroundColor: tagsColor[item], color: tagsColor[item] ? '#fff' : '' }"
                        class="itag">
                        {{ item }}
                    </el-tag>
                </el-tooltip>
            </div>
            <div v-else class="tip_text">
                {{ ing ? '你还没有决定养成任何好习惯，快来添加一个吧~' : '你暂时还没有养成任何好习惯， 加油吧' }}
            </div>
            <!-- 动态添加标签  结果页面不显示此部分 -->
            <div v-if="ing && inputVisibleAll && $route.meta.path !== '/profileVisit'">
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    clearable
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleblur"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加习惯</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {request} from '../../../network/request'
    import {mapGetters} from 'vuex'
    const colors = ['#55efc4', '#81ecec', '#74b9ff', '#a29bfe', '#00b894', '#00cec9', '#ff7675', '#e84393', '#fdcb6e', '#636e72']
    export default {
        name: 'ProfileInfoHabitsTag',
        props: {
            className: { type: String },
            userInfo: { type: Object, default: () => null },
            ing: { type: Number, default: () => 0 }
        },
        data() {
            return {
                tagsData: [],           // 需要渲染的标签数据

                inputVisible: false,    // 决定是否显示
                inputValue: '',         // 输入的内容
                inputVisibleAll: true,  // 进行中的好习惯是否已达上限

                tagsColor: {},          // 标签颜色 键值对形式
                changeColorShow: true,  // 改变color重新渲染
            }
        },
        methods: {
            // 1.删除好习惯标签
            handleClose(index) {
                if (this.getUserId) {
                    this.$prompt(`确定要放弃养成 <span style='color: orange; user-select: none;'>${this.tagsData[index]}</span> 这个好习惯吗？`, '确认？', {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '是的',
                        cancelButtonText: '不！我只是点错了',
                        inputPlaceholder: '请输入当前要删除的习惯',
                        inputValidator: val => {
                            if (!val) return '输入内容不能为空'
                            else if (val.trim() !== this.tagsData[index]) return '输入内容不一致'
                        }
                    }).then(async ({ value }) => {
                        const { data: res } = await request({
                            url: '/removeGoodHabit',
                            method: 'post',
                            data: { user_id: this.getUserId, habit: value }
                        })
                        if (res.status !== 200) return this.$message.error('移除失败，请稍后再试')
                        this.tagsData = this.tagsData.filter(item => item !== this.tagsData[index])
                        this.$message.success('移除成功')
                        this.listenHabit()
                    }).catch(() => this.$message.info('请继续坚持下去吧'))
                } else {
                    this.$message.error('请先登录')
                }
            },
            // 2.失去焦点隐藏input
            handleblur() {
                this.inputVisible = false
            },
            // 2.回车执行保存习惯
            async handleInputConfirm() {
                if (this.inputValue === '') {
                    this.inputVisible = false
                    return;
                }
                const { data: res } = await request({
                    url: '/saveGoodHabit',
                    method: 'post',
                    data: {
                        user_id: this.getUserId,
                        habit: this.inputValue
                    }
                })
                if (res.status === 500) this.$message.error('添加失败，请稍后再试')
                else if (res.status === 201) this.$message.warning('此习惯你已完成养成或已在养成中，请勿重复添加~')
                else {
                    // 1.先将数据添加在页面中，实际已经保存到数据库了，但是页面没有第一时间显示
                    this.tagsData.push(this.inputValue)
                    this.inputValue = ''
                    // 2.提示添加成功
                    this.$message.success('添加成功，望君坚持')
                    // 3.隐藏输入框，显示按钮
                    this.inputVisible = false
                    // 4.执行监听
                    this.listenHabit()
                }
            },
            // 3.显示输入框
            showInput() {
                this.inputVisible = true
                // 使input获取焦点
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            // 4.监听正在进行的好习惯是否达到3个，达到了就不允许再添加
            listenHabit() {
                if (this.tagsData.length >= 3) this.inputVisibleAll = false
                else this.inputVisibleAll = true
            },
            // 5.改变标签颜色
            changeColor(item) {
                this.changeColorShow = false
                this.tagsColor[item] = colors[parseInt(Math.random() * colors.length)]
                this.changeColorShow = true
            }
        },
        computed: {
            ...mapGetters(['getUserId'])
        },
        created() {
            // 赋值需要渲染的tags数据
            this.tagsData = this.ing === 1 ? this.userInfo.habits.habitsing : this.userInfo.habits.complete_habits
            this.listenHabit()
        }
    }
</script>
<style scoped>
    .title {
        font-size: 14px;
        color: #666;
    }
    .tags_data {
        display: flex;
        align-items: center;
        margin-top: 1%;
    }
    .tip_text { color: orange; }
    .itag {
        margin-left: 10px;
        cursor: pointer;
        user-select: none;
    }

    .input-new-tag, .button-new-tag {
        margin-left: 10px;
    }

</style>