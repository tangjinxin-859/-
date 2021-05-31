<template>
  <div class="discovery-container">
    <!--轮播图-->
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item.imageUrl" />
      </el-carousel-item>
    </el-carousel>
    <!--推荐歌单-->
    <div class="recommend">
      <h2 class="title">推荐歌单</h2>
      <div class="items">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ item.copywriter }}</span>
            </div>
            <img :src="item.picUrl" />
            <span
              class="el-icon-video-play"
              @click="toPlayList(item.id)"
            ></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!--最新音乐-->
    <div class="latestMusic">
      <h2 class="title">最新音乐</h2>
      <div class="items">
        <div class="item" v-for="(item, index) in musics" :key="index">
          <div class="img-wrap">
            <img :src="item.picUrl" />
            <span class="el-icon-video-play" @click="playMusic(item.id)"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{ item.name }}</div>
            <div class="singer">{{ item.song.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--推荐MV-->
    <div class="recommendMV">
      <h2 class="title">推荐MV</h2>
      <div class="items">
        <div
          class="item"
          v-for="(item, index) in mvs"
          :key="index"
          @click="toMvList(item.id)"
        >
          <div class="img-wrap">
            <img :src="item.picUrl" />
            <span class="el-icon-video-play"></span>
            <div class="num-wrap">
              <div class="el-icon-view"></div>
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
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Discovery',
  data () {
    return {
      // 轮播图
      banners: [],
      // 推荐歌单
      list: [],
      // 最新音乐
      musics: [],
      // 推荐MV
      mvs: []
    }
  },
  created () {
    // 轮播图
    axios({
      url: 'https://autumnfish.cn/banner',
      method: 'get'
    }).then((res) => {
      this.banners = res.data.banners
    })
    // 推荐歌单
    axios({
      url: 'https://autumnfish.cn/personalized',
      method: 'get',
      params: {
        limit: 10
      }
    }).then((res) => {
      this.list = res.data.result
    })
    // 最新音乐
    axios({
      url: 'https://autumnfish.cn/personalized/newsong',
      method: 'get'
    }).then((res) => {
      this.musics = res.data.result
    })
    // 推荐MV
    axios({
      url: 'https://autumnfish.cn/personalized/mv ',
      method: 'get'
    }).then((res) => {
      this.mvs = res.data.result
      for (let i = 0; i < this.mvs.length; i++) {
        const duration = this.mvs[i].duration
        let min = parseInt(duration / 1000 / 60)
        if (min < 10) min = '0' + min
        let sec = parseInt((duration / 1000) % 60)
        if (sec < 10) sec = '0' + sec
        this.mvs[i].duration = `${min}:${sec}`
      }
      for (let i = 0; i < this.mvs.length; i++) {
        if (this.mvs[i].playCount > 10000) {
          this.mvs[i].playCount = parseInt(this.mvs[i].playCount / 10000) + '万'
        }
      }
    })
  },
  methods: {
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
    toPlayList (id) {
      this.$router.push('/playlist?id=' + id)
    },
    toMvList (id) {
      this.$router.push('/mvlist?id=' + id)
    }
  }
}
</script>
<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.discovery-container .title {
  font-weight: normal;
}

.discovery-container .recommend {
  margin-bottom: 40px;
}

.discovery-container .recommend .items {
  display: flex;
  flex-wrap: wrap;
}

.discovery-container .recommend .items .item {
  width: 200px;
  margin: 10px;
  position: relative;
  overflow: hidden;
}

.discovery-container .recommend .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.discovery-container .recommend .items .item .desc-wrap {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 16px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  max-height: 50px;
  padding: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  top: -50px;
}

.discovery-container .recommend .items .item .desc-wrap span {
  font-size: 14px;
}

.discovery-container .recommend .items .item:hover .desc-wrap {
  top: 0;
}

.discovery-container .recommend .items .item .img-wrap {
  position: relative;
}

.discovery-container .recommend .items .item .img-wrap .el-icon-video-play {
  position: absolute;
  right: 10px;
  bottom: 13px;
  width: 40px;
  height: 40px;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(156, 29, 139);
  opacity: 0;
}

.discovery-container
  .recommend
  .items
  .item
  .img-wrap
  .el-icon-video-play::before {
  transform: translateX(3px);
}

.discovery-container .recommend .items .item:hover .el-icon-video-play {
  opacity: 1;
}

.discovery-container .recommend .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  font-size: 14px;
}

.discovery-container .latestMusic {
  margin-bottom: 40px;
}

.discovery-container .latestMusic .items {
  height: 500px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-left: 15px;
}

.discovery-container .latestMusic .items .item {
  height: 100px;
  width: 50%;
  display: flex;
  align-items: center;
}

.discovery-container .latestMusic .items .item:hover {
  background-color: #f5f5f5;
}

.discovery-container .latestMusic .items .item .img-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.discovery-container .latestMusic .items .item .img-wrap img {
  width: 80px;
  height: 80px;
}

.discovery-container .latestMusic .items .item .img-wrap .el-icon-video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  font-size: 30px;
  color: rgb(156, 29, 139);
  opacity: 0;
}

.discovery-container .latestMusic .items .item:hover .el-icon-video-play {
  opacity: 1;
}

.discovery-container .latestMusic .items .item .song-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding: 10px;
  font-size: 16px;
}

.discovery-container .latestMusic .items .item .song-wrap .singer {
  font-size: 14px;
  color: gray;
}

.discovery-container .recommendMV .items {
  display: flex;
  justify-content: space-around;
}

.discovery-container .recommendMV .items .item {
  width: 250px;
  /* cursor: pointer; */
}

.discovery-container .recommendMV .items .item .img-wrap {
  width: 100%;
  position: relative;
}

.discovery-container .recommendMV .items .item .img-wrap img {
  width: 100%;
  border-radius: 5px;
}

.discovery-container .recommendMV .items .item .img-wrap .el-icon-video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  font-size: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(187, 85, 170, 0.8);
  opacity: 0;
}

.discovery-container .recommendMV .items .item .img-wrap .duration {
  color: white;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 6px;
  margin-right: 4px;
}

.discovery-container
  .recommendMV
  .items
  .item
  .img-wrap
  > .el-icon-video-play::before {
  transform: translateX(3px);
}

.discovery-container .recommendMV .items .item:hover > .el-icon-video-play {
  opacity: 1;
}

.discovery-container .recommendMV .items .item .img-wrap .num-wrap {
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

.discovery-container
  .recommendMV
  .items
  .item
  .img-wrap
  .num-wrap
  .el-icon-view {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.discovery-container .recommendMV .items .item .info-wrap .name {
  font-size: 15px;
  margin-bottom: 5px;
}

.discovery-container .recommendMV .items .item .info-wrap .singer {
  font-size: 14px;
  color: #726f6f;
}
</style>
