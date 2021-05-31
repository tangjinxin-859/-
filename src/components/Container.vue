<template>
  <el-container class="container">
    <el-header>
      <h2>文姬音乐</h2>
      <input
        placeholder="请输入内容"
        @keyup.enter="toResult"
        v-model="inputValue"
      />
    </el-header>
    <el-container class="container_main">
      <el-aside>
        <el-menu>
          <el-menu-item>
            <router-link to="/discovery">
              <span class="el-icon-s-opportunity"></span>
              发现音乐
            </router-link>
          </el-menu-item>
          <el-menu-item>
            <router-link to="/recommend">
              <span class="el-icon-loading"></span>
              推荐歌单
            </router-link>
          </el-menu-item>
          <el-menu-item>
            <router-link to="/latest_music">
              <span class="el-icon-headset"></span>
              最新音乐
            </router-link>
          </el-menu-item>
          <el-menu-item>
            <router-link to="/latest_mv">
              <span class="el-icon-view"></span>
              最新MV
            </router-link>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer>
      <audio :src="musicUrl" controls autoplay></audio>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      inputValue: '',
      musicUrl:
        'http://m701.music.126.net/20210525132724/10467e8e42fb5ca5906c54145cba0d65/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/9069868753/7e27/f464/3dbc/6147be3dad62ede8ec8c4d7698f70f65.mp3'
    }
  },
  methods: {
    toResult () {
      if (this.inputValue) {
        this.$router.push('/result?inquery=' + this.inputValue)
      } else {
        this.$message.warning('输入为空，请重新输入')
      }
    }
  }
}
</script>
<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  width: 100%;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  width: 180px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

.container_main {
  flex: 1;
  overflow: auto;
  margin-bottom: 60px;
}

.el-menu {
  background-color: #d3dce6;
}

.router-link-active {
  text-decoration: none;
  color: #e73881;
}

.el-header {
  display: flex;
  justify-content: space-between;
}

.el-header h2 {
  margin: 0 0 0 30px;
  color: rgb(184, 65, 71);
  font-size: 30px;
}

.el-header input {
  width: 300px;
  border-radius: 50px;
  margin-right: 100px;
  outline: medium;
  border: none;
  text-indent: 20px;
  font-size: 20px;
}

.el-footer {
  position: fixed;
  bottom: 0;
  z-index: 100;
}
.el-footer audio {
  width: 1400px;
  outline: none;
  border: none;
}
</style>
