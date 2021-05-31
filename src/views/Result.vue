<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.inquery }}</h2>
      <span class="sub-title">共找到{{ total }}个结果</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="歌曲" name="first">
        <el-alert
          title="什么都没找到哦! 去搜索其他的试试"
          type="success"
          :closable="false"
          v-if="total == 0"
        >
        </el-alert>
        <table class="el-table" v-else>
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in songLists"
              :key="index"
              @dblclick="playMusic(item.id)"
            >
              <td>{{ index + 1 }}</td>
              <td>
                {{ item.name }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="播放MV"
                  placement="bottom"
                  v-if="item.mvid != 0"
                >
                  <div
                    class="el-icon-video-play"
                    @click="toMvList(item.mvid)"
                  ></div>
                </el-tooltip>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="second">
        <el-alert
          title="什么都没找到哦! 去搜索其他的试试"
          type="success"
          :closable="false"
          v-if="total == 0"
        >
        </el-alert>
        <div class="tab-content" v-else>
          <div class="items">
            <div
              class="item"
              v-for="(item, index) in playLists"
              :key="index"
              @click="toPlayList(item.id)"
            >
              <div class="img-wrap">
                <div class="num-wrap">
                  播放量:
                  <span class="num">{{ item.playCount }}</span>
                </div>
                <img alt="" :src="item.coverImgUrl" />
                <span class="el-icon-video-play"></span>
              </div>
              <p class="name">{{ item.name }}</p>
            </div>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="8"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="third">
        <el-alert
          title="什么都没找到哦! 去搜索其他的试试"
          type="success"
          :closable="false"
          v-if="total == 0"
        >
        </el-alert>
        <div class="mvs" v-else>
          <div class="items">
            <div
              class="item"
              v-for="(item, index) in mvLists"
              :key="index"
              @click="toMvList(item.id)"
            >
              <div class="img-wrap">
                <img :src="item.cover" alt="" />
                <div class="num-wrap">
                  <div class="el-icon-video-play"></div>
                  <div class="num">{{ item.playCount }}</div>
                </div>
                <div class="duration">{{ item.duration }}</div>
              </div>
              <div class="info-wrap">
                <div class="name">{{ item.name }}</div>
                <div class="singer">{{ item.artistName }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="8"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      page: 1,
      total: 0,
      activeName: 'first',
      type: 1,
      songLists: [],
      playLists: [],
      mvLists: [],
      limit: 10
    }
  },
  watch: {
    activeName () {
      switch (this.activeName) {
        case 'first':
          this.type = 1
          break
        case 'second':
          this.type = 1000
          break
        case 'third':
          this.type = 1004
          this.limit = 8
          break
      }
      this.getList()
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getList()
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
    },
    getList () {
      axios({
        url: 'https://autumnfish.cn/search',
        method: 'get',
        params: {
          keywords: this.$route.query.inquery,
          type: this.type,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then((res) => {
        if (this.type === 1) {
          console.log(res)
          this.songLists = res.data.result.songs
          this.total = res.data.result.songCount
          for (let i = 0; i < this.songLists.length; i++) {
            const duration = this.songLists[i].duration
            let min = parseInt(duration / 1000 / 60)
            if (min < 10) min = '0' + min
            let sec = parseInt((duration / 1000) % 60)
            if (sec < 10) sec = '0' + sec
            this.songLists[i].duration = `${min}:${sec}`
          }
        } else if (this.type === 1000) {
          this.playLists = res.data.result.playlists
          this.total = res.data.result.playlistCount
          for (let i = 0; i < this.playLists.length; i++) {
            if (this.playLists[i].playCount > 10000) {
              this.playLists[i].playCount =
                parseInt(this.playLists[i].playCount / 10000) + '万'
            }
          }
        } else if (this.type === 1004) {
          this.mvLists = res.data.result.mvs
          this.total = res.data.result.mvCount
          for (let i = 0; i < this.mvLists.length; i++) {
            if (this.mvLists[i].playCount > 10000) {
              this.mvLists[i].playCount =
                parseInt(this.mvLists[i].playCount / 10000) + '万'
            }
          }
          for (let i = 0; i < this.mvLists.length; i++) {
            const duration = this.mvLists[i].duration
            let min = parseInt(duration / 1000 / 60)
            if (min < 10) min = '0' + min
            let sec = parseInt((duration / 1000) % 60)
            if (sec < 10) sec = '0' + sec
            this.mvLists[i].duration = `${min}:${sec}`
          }
        }
      })
    },
    toPlayList (id) {
      this.$router.push('/playlist?id=' + id)
    },
    toMvList (id) {
      this.$router.push('/mvlist?id=' + id)
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style scoped>
.result-container .title-wrap {
  display: flex;
  align-items: center;
  text-align: center;
}

.result-container .title-wrap .title {
  font-size: 20px;
}

.result-container .title-wrap .sub-title {
  margin-left: 30px;
  font-size: 15px;
  color: #8a8785;
}

.result-container .el-table {
  margin-top: 10px;
  border-collapse: collapse;
}

.result-container .el-table .el-icon-video-play {
  color: red;
}

.result-container .el-table tr:nth-child(2n) {
  background-color: #dfe6e5;
}

.result-container .el-table td:nth-child(6n + 1),
.result-container .el-table th:nth-child(1) {
  width: 20px;
  text-align: center;
}

.result-container .el-table td:nth-child(6n + 2),
.result-container .el-table th:nth-child(2) {
  width: 70px;
  text-align: center;
}

.result-container .el-table td:nth-child(6n + 3),
.result-container .el-table th:nth-child(3) {
  width: 150px;
  text-align: center;
}

.result-container .el-table td:nth-child(6n + 4),
.result-container .el-table th:nth-child(4) {
  width: 150px;
  text-align: center;
}

.result-container .el-table td:nth-child(6n + 5),
.result-container .el-table th:nth-child(5) {
  width: 150px;
  text-align: center;
}

.result-container .el-table td:nth-child(6n + 6),
.result-container .el-table th:nth-child(6) {
  width: 70px;
  text-align: center;
}

.result-container .el-table tr {
  height: 80px;
  cursor: pointer;
}

.result-container .el-table tr:hover {
  background-color: #c7c2c0;
}

.result-container .tab-content {
  margin-top: 20px;
}

.result-container .tab-content .items {
  display: flex;
  flex-wrap: wrap;
}

.result-container .tab-content .items .item {
  width: 200px;
  margin: 10px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.result-container .tab-content .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.result-container .tab-content .items .item .num-wrap {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  color: white;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.5);
  height: 30px;
  width: 100%;
  padding-left: 5px;
  top: -30px;
  overflow: hidden;
}

.result-container .tab-content .items .item:hover .num-wrap {
  top: 0;
}

.result-container .tab-content .items .item .img-wrap {
  position: relative;
}

.result-container .tab-content .items .item .img-wrap .el-icon-video-play {
  position: absolute;
  right: 10px;
  bottom: 13px;
  width: 40px;
  height: 40px;
  color: #ee0000;
  font-size: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.result-container
  .tab-content
  .items
  .item
  .img-wrap
  .el-icon-video-play::before {
  transform: translateX(3px);
}

.result-container
  .tab-content
  .items
  .item
  .img-wrap:hover
  .el-icon-video-play {
  opacity: 1;
}

.result-container .tab-content .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 14px;
}

.result-container .mvs .items {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-content: center;
}

.result-container .mvs .items .item {
  width: 250px;
  cursor: pointer;
  margin-right: 30px;
  margin-bottom: 30px;
}

.result-container .mvs .items .item .img-wrap {
  width: 100%;
  position: relative;
}

.result-container .mvs .items .item .img-wrap > img {
  width: 100%;
}

.result-container .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  display: flex;
  align-content: center;
  padding-right: 6px;
  padding-top: 6px;
}

.result-container .mvs .items .item .img-wrap .num-wrap .el-icon-video-play {
  margin-right: 3px;
  margin-top: 3px;
}

.result-container .mvs .items .item .img-wrap .duration {
  color: white;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 6px;
  margin-right: 4px;
}

.result-container .mvs .items .item .info-wrap .name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 15px;
}
.result-container .mvs .items .item .info-wrap .singer {
  color: rgb(128, 128, 128);
  font-size: 15px;
}
</style>
