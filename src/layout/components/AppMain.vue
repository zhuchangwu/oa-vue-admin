<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import store from '@/store'

  export default {
    name: 'AppMain',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.path
      }
    },
    data() {
      return {
        logout: '',// 是否被挤下去的标示
        timeId: '',// 定时器ID
        socket: null
      }
    },
    created() {
      console.log('重新连接：')
      this.initSocket()
      console.log('重新连接：')

    },
    methods: {
      initSocket() {
        // todo 建立连接前判断浏览器中是否存在用户的信息

        // 判断当前的浏览器是否支持WebSocket
        if (window.WebSocket) {
          // 检验当前的webSocket是否存在,以及连接的状态,如已经连接,直接返回
          if (this.socket !== undefined && this.socket !== null && this.socket.readyState === WebSocket.OPEN) {
            return false
          } else {
            // 实例化 , 第二个ws是我们可以自定义的, 根据后端的路由来
            console.log('准备建立连接～')
            this.socket = new WebSocket('ws://127.0.0.1:8084/ws')
            // 初始化WebSocket原生的方法
            this.socket.onopen = () => {
              console.log('连接建立成功了～')
              var msg = {
                'action': 0,
                'username': this.$store.getters.username,
                'content': '',
                'acceptUser': null
              }
              // 发送请求建立连接的请求
              if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(msg))
              } else {
                // 重新连接
                this.initSocket()
              }

              // 定时发送心跳
              var heartMsg = {
                'action': 1,
                'username': this.$store.getters.username,
                'content': 'heart msg',
                'acceptUser': null
              }
              var that = this
              setInterval(function() {
                console.log("定时发送心跳")
                that.socket.send(JSON.stringify(heartMsg))
                console.log("定时发送心跳结束")
              }, 5000)
            }

            // 服务端将消息返回～
            this.socket.onmessage = (msg) => {
              console.log('服务端发送了消息 ', msg)
              // 服务端通知本账号在其他地方登陆了
              if (msg.data === 'logout') {
                // 清除定时器
                window.clearInterval(this.timeId)
                // 清空本地缓存token
                store.dispatch('user/resetToken')
                // 标记当前是被动退出，不再主动重新建立连接
                this.logout = msg.data
                // 删除本地缓存，跳转到登陆页面
                MessageBox.confirm('您的账号在其他设备登陆，请重新登陆～', 'Confirm logout', {
                  confirmButtonText: 'Re-Login',
                  showClose: false,
                  showCancelButton: false,
                  type: 'warning'
                }).then(() => {
                  store.dispatch('user/resetToken').then(() => {
                    location.reload()
                  })
                })
              }
              // 服务端返回的心跳
              if (msg.data === 'ok') {
                console.log('服务端返回心跳：', msg.data)
              }
            }
            // 出错时回调
            this.socket.onerror = (err) => {
              console.log('出错了～ ', err)
              window.clearInterval(this.timeId)
            }
            // 关闭时回调
            this.socket.onclose = () => {
              window.clearInterval(this.timeId)
              console.log('连接在服务端被remove')
              // 只要不是服务端说有其他用户登陆了，其他任何情况都重新连接
              if (this.logout !== 'logout') {
                console.log('10秒钟后重新连接')
                var that = this
                setTimeout(function() {
                  // 被挤下去的才会重新连接
                  if (that.logout !== 'logout') {
                    that.initSocket()
                  }
                }, 10000)
              }
            }
          }
        } else {
          alert('当前设备不支持WebSocket')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .fixed-header + .app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      /* 84 = navbar + tags-view = 50 + 34 */
      min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
      padding-top: 84px;
    }
  }
</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
