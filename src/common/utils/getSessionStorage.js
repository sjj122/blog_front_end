export function getSessionStorage() {
  if (window.localStorage.getItem('user_id') !== null) {
    const user = {
      user_id: window.localStorage.getItem('user_id'),
      nickname: window.localStorage.getItem('nickname'),
      avatar: window.localStorage.getItem('avatar'),
      myLike: window.localStorage.getItem('myLike')
    }
    return user
  }
  // 啥都没有就return false
  return false
}
