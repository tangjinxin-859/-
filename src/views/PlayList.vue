<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playList.coverImgUrl" />
      </div>
      <div class="info-wrap">
        <p class="title">{{ playList.name }}</p>
        <div class="author-wrap">
          <img :src="img" />
          <span class="name">{{ username }}</span>
          <span class="time">{{ playList.createTime }}</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <span>{{ playList.tags }}</span>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playList.description }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="歌曲列表" name="first">
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
            <tr
              v-for="(item, index) in playList.tracks"
              :key="index"
              @dblclick="playMusic(item.id)"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="img-wrap">
                  <img :src="item.al.picUrl" alt="" />
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <span>{{ item.al.name }}</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="播放MV"
                    placement="bottom"
                    v-if="item.mv != 0"
                  >
                    <div class="el-icon-video-play"></div>
                  </el-tooltip>
                </div>
              </td>
              <td>{{ item.ar[0].name }}</td>
              <td>{{ item.al.name }}</td>
              <td>{{ item.dt }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="'评论(' + playList.commentCount + ')'" name="second">
        <el-alert
          title="什么都没找到哦! 去搜索其他的试试"
          type="success"
          :closable="false"
          v-if="playList.commentCount == 0"
        >
        </el-alert>
        <!--精彩评论-->
        <div class="comment-wrap" v-else>
          <p class="title">
            精彩评论<span class="number">({{ hotCount }})</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in hotComment" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != 0">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <!-- <div class="date">2020-02-12 17:26:11</div> -->
                <div class="date">
                  <span>{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="hotCount"
          >
          </el-pagination>
        </div>

        <!-- 最新评论 -->
        <div class="comment-wrap" v-if="latestCount != 0">
          <p class="title">
            最新评论<span class="number">({{ latestCount }})</span>
          </p>
          <div class="comments-wrap">
            <div
              class="item"
              v-for="(item, index) in latestComment"
              :key="index"
            >
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != 0">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="latestCount"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'PlayListum',
  data () {
    return {
      activeName: 'first',
      total: 0,
      page: 1,
      img: '',
      username: '',
      playList: {},
      hotComment: [],
      hotCount: 0,
      latestCount: 0,
      latestComment: []
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
      this.getHotComment()
      this.getLatestComment()
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
    getPlayList () {
      axios({
        url: 'https://autumnfish.cn/playlist/detail',
        method: 'get',
        params: {
          id: this.$route.query.id
        }
      }).then((res) => {
        this.playList = res.data.playlist
        this.img = res.data.playlist.creator.avatarUrl
        this.username = res.data.playlist.creator.nickname
        for (let i = 0; i < this.playList.tracks.length; i++) {
          const dt = this.playList.tracks[i].dt
          let min = parseInt(dt / 1000 / 60)
          if (min < 10) min = '0' + min
          let sec = parseInt((dt / 1000) % 60)
          if (sec < 10) sec = '0' + sec
          this.playList.tracks[i].dt = `${min}:${sec}`
        }
        this.playList.createTime = new Date(
          this.playList.createTime
        ).toLocaleDateString()
      })
    },
    getHotComment () {
      axios({
        url: 'https://autumnfish.cn/comment/hot',
        method: 'get',
        params: {
          id: this.$route.query.id,
          type: 2,
          limit: 10,
          offset: (this.page - 1) * 10
        }
      }).then((res) => {
        this.hotComment = res.data.hotComments
        this.hotCount = res.data.total
        for (let i = 0; i < this.hotComment.length; i++) {
          this.hotComment[i].time = new Date(
            this.hotComment[i].time
          ).toLocaleDateString()
        }
      })
    },
    getLatestComment () {
      axios({
        url: 'https://autumnfish.cn/comment/playlist',
        method: 'get',
        params: {
          id: this.$route.query.id,
          limit: 10,
          offset: (this.page - 1) * 10
        }
      }).then((res) => {
        this.latestCount = res.data.total
        this.latestComment = res.data.comments
        for (let i = 0; i < this.latestComment.length; i++) {
          this.latestComment[i].time = new Date(
            this.latestComment[i].time
          ).toLocaleDateString()
        }
      })
    }
  },
  created () {
    this.getPlayList()
    this.getHotComment()
    this.getLatestComment()
  }
}
</script>
<style scoped>
.playlist-container .top-wrap {
  display: flex;
}

.playlist-container .top-wrap .img-wrap {
  width: 250px;
  margin-right: 20px;
}

.playlist-container .top-wrap .img-wrap img {
  width: 100%;
}

.playlist-container .top-wrap .info-wrap {
  text-align: left;
  font-size: 17px;
}
.playlist-container .top-wrap .info-wrap .author-wrap {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
}

.playlist-container .top-wrap .info-wrap .author-wrap img {
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.playlist-container .top-wrap .info-wrap .author-wrap .name {
  margin-right: 10px;
}

.playlist-container .top-wrap .info-wrap .play-wrap {
  margin-bottom: 14px;
}

.playlist-container .top-wrap .info-wrap .tag-wrap {
  margin-bottom: 14px;
}

.playlist-container .el-table {
  margin-top: 10px;
  border-collapse: collapse;
}

.playlist-container .el-table tr:nth-child(2n) {
  background-color: #dfe6e5;
}

.playlist-container .el-table td:nth-child(6n + 1),
.playlist-container .el-table th:nth-child(1) {
  width: 20px;
  text-align: center;
}

.playlist-container .el-table td:nth-child(6n + 2),
.playlist-container .el-table th:nth-child(2) {
  width: 70px;
  text-align: center;
}

.playlist-container .el-table td:nth-child(6n + 3),
.playlist-container .el-table th:nth-child(3) {
  width: 150px;
  text-align: center;
}

.playlist-container .el-table td:nth-child(6n + 4),
.playlist-container .el-table th:nth-child(4) {
  width: 150px;
  text-align: center;
}

.playlist-container .el-table td:nth-child(6n + 5),
.playlist-container .el-table th:nth-child(5) {
  width: 150px;
  text-align: center;
}

.playlist-container .el-table td:nth-child(6n + 6),
.playlist-container .el-table th:nth-child(6) {
  width: 70px;
  text-align: center;
}

.playlist-container .el-table tr:hover {
  background-color: #c7c2c0;
}
.playlist-container .el-table .img-wrap {
  width: 100%;
  position: relative;
}

.playlist-container .el-table .img-wrap img {
  width: 70px;
  height: 70px;
}

.playlist-container .el-table .song-wrap .el-icon-video-play {
  margin-left: 10px;
  font-size: 20px;
  color: rgb(236, 92, 92);
}

.playlist-container .el-table .song-wrap .bottom {
  clear: both;
  text-align: center;
}

.playlist-container .el-table .song-wrap .item {
  margin: 4px;
}
.playlist-container .comment-wrap {
  margin-bottom: 70px;
  text-align: left;
}

.playlist-container .comment-wrap .title {
  font-size: 20px;
}

.playlist-container .comment-wrap .title .number {
  color: black;
  font-size: 18px;
}

.playlist-container .comment-wrap .item {
  display: flex;
  padding-top: 20px;
}

.playlist-container .comment-wrap .item .icon-wrap {
  margin-right: 15px;
}

.playlist-container .comment-wrap .item .icon-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.playlist-container .comment-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px solid #f2f2f1;
}

.playlist-container .comment-wrap .item .date {
  color: #bebebe;
  font-size: 14px;
}

.playlist-container .comment-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
}

.playlist-container .comment-wrap .item .content-wrap .name {
  color: #517eaf;
  font-size: 14px;
}

.playlist-container .comment-wrap .item .content-wrap .comment {
  font-size: 14px;
}

.playlist-container .comment-wrap .item .content-wrap .content,
.playlist-container .comment-wrap .item .content-wrap .re-content {
  margin-bottom: 10px;
}

.playlist-container .comment-wrap .item .content-wrap .re-content {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}
</style>
