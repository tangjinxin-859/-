<template>
  <div class="mvlist-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="url" autoplay>
          抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以
          <a href="https://www.baidu.com">下载</a>
          并用你喜欢的播放器观看!
        </video>
      </div>

      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="mvDetail.cover" alt="" />
          </div>
          <!-- 发布者昵称 -->
          <span class="name">{{ mvDetail.artistName }}</span>
        </div>
        <div class="mv-info">
          <!-- mv名称 -->
          <h2 class="title">{{ mvDetail.name }}</h2>
          <span class="date">发布：{{ mvDetail.publishTime }}</span>
          <span class="number">播放：{{ mvDetail.playCount }}次</span>
          <p class="desc">{{ mvDetail.desc }}</p>
        </div>
      </div>
      <el-alert
        title="好像没有评论耶~"
        effect="dark"
        type="info"
        center
        show-icon
        v-if="hotCount == 0 && latestCount == 0"
      >
      </el-alert>
      <!-- 精彩评论 -->
      <div class="comment-wrap">
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
                <span class="name">{{ item.user.nickname }}:</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="date">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论<span class="number">({{ latestCount }})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in latestComment" :key="index">
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
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="latestCount"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 相关推荐 -->
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in simiMvs" :key="index">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="el-icon-video-play" @click="init(item.id)"></span>
              <div class="num-wrap">
                <div class="el-icon-video-play"></div>
                <div class="num">{{ item.playCount }}</div>
              </div>
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'MvList',
  data () {
    return {
      page: 1,
      latestCount: 0,
      hotCount: 0,
      url: '',
      simiMvs: [],
      mvDetail: {},
      latestComment: [],
      hotComment: []
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getComment()
    },
    playMv () {
      axios({
        url: 'https://autumnfish.cn/mv/url',
        method: 'get',
        params: {
          id: this.$route.query.id
        }
      }).then((res) => {
        this.url = res.data.data.url
      })
    },
    getDetail () {
      axios({
        url: 'https://autumnfish.cn/mv/detail',
        method: 'get',
        params: {
          mvid: this.$route.query.id
        }
      }).then((res) => {
        console.log(res)
        this.mvDetail = res.data.data
        this.mvDetail.playCount =
          parseInt(this.mvDetail.playCount / 10000) + '万'
      })
    },
    simiMv () {
      axios({
        url: 'https://autumnfish.cn/simi/mv',
        method: 'get',
        params: {
          mvid: this.$route.query.id
        }
      }).then((res) => {
        console.log(res)
        this.simiMvs = res.data.mvs
        for (let i = 0; i < this.simiMvs.length; i++) {
          const duration = this.simiMvs[i].duration
          let min = parseInt(duration / 1000 / 60)
          if (min < 10) min = '0' + min
          let sec = parseInt((duration / 1000) % 60)
          if (sec < 10) sec = '0' + sec
          this.simiMvs[i].duration = `${min}:${sec}`
        }
        for (let i = 0; i < this.simiMvs.length; i++) {
          if (this.simiMvs[i].playCount > 10000) {
            this.simiMvs[i].playCount =
              parseInt(this.simiMvs[i].playCount / 10000) + '万'
          }
        }
      })
    },
    getComment () {
      axios({
        url: 'https://autumnfish.cn/comment/mv',
        method: 'get',
        params: {
          id: this.$route.query.id,
          limit: 8,
          offset: (this.page - 1) * 8
        }
      }).then((res) => {
        console.log(res)
        this.latestComment = res.data.comments
        this.hotComment = res.data.hotComments
        this.hotCount = res.data.hotComments.length
        this.latestCount = res.data.total
        for (let i = 0; i < this.hotComment.length; i++) {
          this.hotComment[i].time = new Date(
            this.hotComment[i].time
          ).toLocaleDateString()
        }
        for (let i = 0; i < this.latestComment.length; i++) {
          this.latestComment[i].time = new Date(
            this.latestComment[i].time
          ).toLocaleDateString()
        }
      })
    },
    init (id) {
      this.$route.query.id = id
      this.playMv()
      this.getDetail()
      this.simiMv()
      this.getComment()
    }
  },
  created () {
    this.playMv()
    this.getDetail()
    this.simiMv()
    this.getComment()
  }
}
</script>
<style scoped>
.mvlist-container {
  display: flex;
}

.mvlist-container .title {
  margin-bottom: 20px;
}

.mvlist-container .mv-wrap {
  width: 700px;
  margin-right: 35px;
}

.mvlist-container .mv-wrap .date {
  margin-right: 25px;
}

.mvlist-container .mv-wrap .date {
  color: #bebebe;
  font-size: 14px;
}

.mvlist-container .mv-wrap .video-wrap {
  width: 100%;
  height: 390px;
  margin-bottom: 20px;
}

.mvlist-container .mv-wrap .video-wrap video {
  border-radius: 5px;
  height: 100%;
  width: 100%;
  outline: none;
}

.mvlist-container .mv-wrap .info-wrap {
  margin-bottom: 50px;
  text-align: left;
}

.mvlist-container .mv-wrap .info-wrap .singer-info {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}

.mvlist-container .mv-wrap .info-wrap .singer-info .avatar-wrap {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
}

.mvlist-container .mv-wrap .info-wrap .singer-info .avatar-wrap img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.mvlist-container .mv-wrap .info-wrap .mv-info .title {
  font-size: 30px;
}

.mvlist-container .mv-wrap .info-wrap .mv-info .desc {
  font-size: 15px;
  margin-top: 20px;
}

.mvlist-container .mv-wrap .comment-wrap {
  margin-bottom: 70px;
  text-align: left;
}

.mvlist-container .mv-wrap .comment-wrap .title {
  font-size: 25px;
}

.mvlist-container .mv-wrap .comment-wrap .title .number {
  color: black;
  font-size: 20px;
}

.mvlist-container .mv-wrap .comment-wrap .item {
  display: flex;
  padding-top: 20px;
}

.mvlist-container .mv-wrap .comment-wrap .item .icon-wrap {
  margin-right: 15px;
}

.mvlist-container .mv-wrap .comment-wrap .item .icon-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.mvlist-container .mv-wrap .comment-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px solid #f2f2f1;
}

.mvlist-container .mv-wrap .comment-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
}

.mvlist-container .mv-wrap .comment-wrap .item .content-wrap .name {
  color: #517eaf;
  font-size: 14px;
}

.mvlist-container .mv-wrap .comment-wrap .item .content-wrap .comment {
  font-size: 14px;
}

.mvlist-container .mv-wrap .comment-wrap .item .content-wrap .content,
.mvlist-container .mv-wrap .comment-wrap .item .content-wrap .re-content {
  margin-bottom: 10px;
}

.mvlist-container .mv-wrap .comment-wrap .item .content-wrap .re-content {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}

.mvlist-container .mv-recommend {
  flex: 1;
}

.mvlist-container .mv-recommend .mvs .items {
  display: flex;
  flex-wrap: wrap;
}

.mvlist-container .mv-recommend .mvs .items .item {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.mvlist-container .mv-recommend .mvs .items .item:hover {
  background-color: #f5f5f5;
}

.mvlist-container .mv-recommend .mvs .items .item .img-wrap {
  width: 180px;
  position: relative;
  margin-right: 10px;
}

.mvlist-container
  .mv-recommend
  .mvs
  .items
  .item
  .img-wrap
  > .el-icon-video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  color: #ee0000;
  font-size: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.mvlist-container
  .mv-recommend
  .mvs
  .items
  .item
  .img-wrap
  > .el-icon-video-play::before {
  transform: translateX(3px);
}

.mvlist-container
  .mv-recommend
  .mvs
  .items
  .item
  .img-wrap:hover
  > .el-icon-video-play {
  opacity: 1;
}

.mvlist-container .mv-recommend .mvs .items .item .img-wrap img {
  width: 100%;
  border-radius: 5px;
}

.mvlist-container .mv-recommend .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  align-content: center;
  font-size: 15px;
  padding-right: 5px;
  padding-top: 2px;
}

.mvlist-container
  .mv-recommend
  .mvs
  .items
  .item
  .img-wrap
  .num-wrap
  .el-icon-video-play {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.mvlist-container .mv-recommend .mvs .items .item .img-wrap .time {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: white;
  font-size: 15px;
}

.mvlist-container .mv-recommend .mvs .items .item .info-wrap {
  flex: 1;
}

.mvlist-container .mv-recommend .mvs .items .item .info-wrap .name {
  font-size: 15px;
}

.mvlist-container .mv-recommend .mvs .items .item .info-wrap .singer {
  font-size: 14px;
  color: #c5c5c5;
}
</style>
