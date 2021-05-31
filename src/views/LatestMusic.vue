<template>
  <div class="music-container">
    <div class="tab-bar">
      <span
        :class="['item', { active: selected == '0' }]"
        @click="selected = '0'"
        >全部</span
      >
      <span
        :class="['item', { active: selected == '7' }]"
        @click="selected = '7'"
        >华语</span
      >
      <span
        :class="['item', { active: selected == '96' }]"
        @click="selected = '96'"
        >欧美</span
      >
      <span
        :class="['item', { active: selected == '8' }]"
        @click="selected = '8'"
        >日本</span
      >
      <span
        :class="['item', { active: selected == '16' }]"
        @click="selected = '16'"
        >韩国</span
      >
    </div>
    <table class="el-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in lists" :key="index" @dblclick="playMusic(item.id)">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl" alt="" />
              <span
                class="el-icon-video-play"
                @click="playMusic(item.id)"
              ></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <span>{{ item.name }}</span>
              <!--
              <el-tooltip
                class="item"
                effect="dark"
                content="添加到播放列表"
                placement="bottom"
              >
                <div class="el-icon-circle-plus-outline"></div>
              </el-tooltip>
              -->
            </div>
          </td>
          <td>{{ item.album.artists[0].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'LatestMusic',
  data () {
    return {
      // 歌曲列表
      lists: [],
      // 分类
      selected: '0'
    }
  },
  watch: {
    selected () {
      this.getList()
    }
  },
  methods: {
    getList () {
      axios({
        url: 'https://autumnfish.cn/top/song',
        method: 'get',
        params: {
          type: this.selected
        }
      }).then((res) => {
        this.lists = res.data.data
        // 处理时长 毫秒 分秒
        for (let i = 0; i < this.lists.length; i++) {
          const duration = this.lists[i].duration
          let min = parseInt(duration / 1000 / 60)
          if (min < 10) min = '0' + min
          let sec = parseInt((duration / 1000) % 60)
          if (sec < 10) sec = '0' + sec
          this.lists[i].duration = `${min}:${sec}`
        }
      })
    },
    playMusic (id) {
      axios({
        url: 'https://autumnfish.cn/song/url',
        method: 'get',
        params: {
          id // id:id
        }
      }).then((res) => {
        const url = res.data.data[0].url
        this.$parent.$parent.$parent.$parent.musicUrl = url
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>
.music-container .tab-bar {
  display: flex;
  justify-content: flex-end;
}

.music-container .tab-bar .item {
  font-size: 20px;
  color: gray;
  margin-right: 20px;
  cursor: pointer;
}
.music-container .tab-bar .item.active {
  color: red;
}

.music-container .el-table {
  margin-top: 10px;
  border-collapse: collapse;
}

.music-container .el-table tr:nth-child(2n) {
  background-color: #dfe6e5;
}

.music-container .el-table td:nth-child(6n + 1),
.music-container .el-table th:nth-child(1) {
  width: 20px;
  text-align: center;
}

.music-container .el-table td:nth-child(6n + 2),
.music-container .el-table th:nth-child(2) {
  width: 70px;
  text-align: center;
}

.music-container .el-table td:nth-child(6n + 3),
.music-container .el-table th:nth-child(3) {
  width: 150px;
  text-align: center;
}

.music-container .el-table td:nth-child(6n + 4),
.music-container .el-table th:nth-child(4) {
  width: 150px;
  text-align: center;
}

.music-container .el-table td:nth-child(6n + 5),
.music-container .el-table th:nth-child(5) {
  width: 150px;
  text-align: center;
}

.music-container .el-table td:nth-child(6n + 6),
.music-container .el-table th:nth-child(6) {
  width: 70px;
  text-align: center;
}

.music-container .el-table tr:hover {
  background-color: #c7c2c0;
}
.music-container .el-table .img-wrap {
  width: 100%;
  position: relative;
}

.music-container .el-table .img-wrap img {
  width: 70px;
  height: 70px;
}

.music-container .el-table .img-wrap .el-icon-video-play {
  font-size: 20px;
  color: rgb(238, 74, 74);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.music-container .el-table .song-wrap .el-icon-circle-plus-outline {
  margin-left: 10px;
  font-size: 20px;
  color: rgb(236, 92, 92);
}

.music-container .el-table .song-wrap .bottom {
  clear: both;
  text-align: center;
}

.music-container .el-table .song-wrap .item {
  margin: 4px;
}
</style>
