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
            this.socket = new WebSocket('ws://192.168.43.52:8084/ws')
            // 初始化WebSocket原生的方法
            this.socket.onopen = this.myopen()
            this.socket.onmessage = this.mymessage()
            this.socket.onerror = (err) => {
              console.log('出错了～ ', err)
            }

            // 关闭时回调
            this.socket.onclose = () => {
              console.log('连接在服务端被remove, 10秒钟后重新连接')
              var that = this
              setTimeout(function() {
                that.initSocket()
              }, 10000)
              // 尝试重新连接
            }

          }
        } else {
          alert('当前设备不支持WebSocket')
        }
      },
      // 发送聊天消息
      chat(msg) {
        // 如果的当前的WebSocket是连接的状态,直接发送 否则从新连接
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(msg)
        } else {
          // 重新连接
          this.initSocket()
          // 延迟一会,从新发送
          setTimeout(1000)
          this.socket.send(msg)
        }
      },
      // 当连接建立完成后对调
      myopen() {
        console.log('连接建立成功了～')
        // 拉取连接建立之前的未签收的消息记录
        // 发送心跳包
      },
      mymessage(msg) {
        // 因为服务端可以主动的推送消息,我们提前定义和后端统一msg的类型, 如,拉取好友信息的消息,或 聊天的消息
        if (msg === '聊天内容') {
          // 发送请求签收消息,改变请求的状态
          // 将消息缓存到本地
          // 将msg 转换成消息对象, 植入html进行渲染
        } else if (msg === '拉取好友列表') {
          // 发送请求更新好友列表
        }
      },
      myerror(err) {
        console.log('连接出现异常... ', err)
      },
      keepalive() {
        // 构建对象
        var dataContent = {}
        // 发送心跳
        this.chat(JSON.stringify(dataContent))
        // 定时执行函数, 其他操作
        // 拉取未读消息
        // 拉取好友信息
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
