import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 1.当前登录的用户信息
    user: {
      nickname: '',
      user_id: '',
      avatar: '',
      myLike: [],
    },
    // 2.是否显示 照片墙页面 的动画箭头 --- 默认显示
    isShowPhotoArrow: true,
    // 3.showWho变量，控制profile页面的menu
    showWho: '1'
  },
  getters: {
    getShowWho(state, getters) {
      return state.showWho
    },
    getNickName(state, getters) {
      return state.user.nickname
    },
    getUserId(state, getters) {
      return state.user.user_id
    },
    getAvatarUrl(state, getters) {
      return state.user.avatar
    },
    getMyLike(state, getters) {
      return state.user.myLike
    },
    getPhotoArrow(state, getters) {
      return state.isShowPhotoArrow
    }
  },
  mutations: {
    setShowWho(state, payload) {
      state.showWho = payload
    },
    setUserInfo(state, payload) {
      state.user = payload
    },
    clearUserInfo(state, payload) {
      state.user = {
        nickname: '',
        user_id: '',
        avatar: '',
        myLike: [],
      }
    },
    setUserAvatar(state, payload) {
      state.user.avatar = payload.imageUrl
    },
    setUserMyLike(state, payload) {
      state.user.myLike = payload.myLike
    },
    changePhotoArrow(state) {
      state.isShowPhotoArrow = !state.isShowPhotoArrow
    }
   },
  actions: {
  },
  modules: {
  }
})
