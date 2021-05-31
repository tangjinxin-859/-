<template>
  <div class="recommend-container">
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="topList.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">{{ topList.name }}</div>
        <div class="info">
          {{ topList.description }}
        </div>
      </div>
      <img :src="topList.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span
          :class="['item', { active: selected == '全部' }]"
          @click="selected = '全部'"
        >
          全部
        </span>
        <span
          :class="['item', { active: selected == '欧美' }]"
          @click="selected = '欧美'"
          >欧美</span
        >
        <span
          :class="['item', { active: selected == '华语' }]"
          @click="selected = '华语'"
          >华语</span
        >
        <span
          :class="['item', { active: selected == '流行' }]"
          @click="selected = '流行'"
          >流行</span
        >
        <span
          :class="['item', { active: selected == '说唱' }]"
          @click="selected = '说唱'"
          >说唱</span
        >
        <span
          :class="['item', { active: selected == '摇滚' }]"
          @click="selected = '摇滚'"
          >摇滚</span
        >
        <span
          :class="['item', { active: selected == '民谣' }]"
          @click="selected = '民谣'"
          >民谣</span
        >
        <span
          :class="['item', { active: selected == '电子' }]"
          @click="selected = '电子'"
          >电子</span
        >
        <span
          :class="['item', { active: selected == '轻音乐' }]"
          @click="selected = '轻音乐'"
          >轻音乐</span
        >
        <span
          :class="['item', { active: selected == '影视原声' }]"
          @click="selected = '影视原声'"
          >影视原声</span
        >
        <span
          :class="['item', { active: selected == 'ACG' }]"
          @click="selected = 'ACG'"
          >ACG</span
        >
        <span
          :class="['item', { active: selected == '怀旧' }]"
          @click="selected = '怀旧'"
          >怀旧</span
        >
      </div>
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item, index) in playLists" :key="index">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img alt="" :src="item.coverImgUrl" />
              <span
                class="el-icon-video-play"
                @click="toPlayList(item.id)"
              ></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Recommend',
  data () {
    return {
      page: 1,
      total: 0,
      selected: '全部',
      // 顶部的推荐歌单
      topList: {},
      // 歌单列表
      playLists: []
    }
  },
  // 侦听器
  watch: {
    selected () {
      this.topData()
      this.listData()
      this.page = 1
    }
  },
  created () {
    this.topData()
    this.listData()
  },
  methods: {
    // 抽取的方法1 顶部的数据
    topData () {
      axios({
        url: 'https://autumnfish.cn/top/playlist/highquality',
        method: 'get',
        params: {
          limit: 1,
          cat: this.selected
        }
      }).then((res) => {
        this.topList = res.data.playlists[0]
      })
    },
    // 抽取的方法2 列表数据
    listData () {
      axios({
        url: 'https://autumnfish.cn/top/playlist',
        method: 'get',
        params: {
          limit: 10,
          offset: (this.page - 1) * 10, // 偏移数量 用于分页
          cat: this.selected // 歌单的标签
        }
      }).then((res) => {
        this.total = res.data.total
        this.playLists = res.data.playlists
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // 页码改变事件
      console.log(`当前页: ${val}`)
      this.page = val
      this.listData()
    },
    toPlayList (id) {
      this.$router.push('/playlist?id=' + id)
    }
  }
}
</script>
<style scoped>
.recommend-container .top-card {
  padding: 20px;
  height: 200px;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.recommend-container .top-card .icon-wrap {
  margin-right: 20px;
  z-index: 1;
}

.recommend-container .top-card .icon-wrap img {
  width: 160px;
  height: 160px;
}

.recommend-container .top-card .content-wrap {
  z-index: 1;
}

.recommend-container .top-card .content-wrap .tag {
  color: #dfac67;
  border: 1px solid #dfac67;
  width: 100px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
}

.recommend-container .top-card .content-wrap .title {
  color: white;
  padding-top: 10px;
}

.recommend-container .top-card .content-wrap .info {
  color: #888482;
  font-size: 14px;
  padding-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}

.recommend-container .top-card .bg {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  filter: blur(20px);
}

.recommend-container .top-card .bg-mask {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.recommend-container .tab-container {
  padding-top: 30px;
}

.recommend-container .tab-container .tab-bar {
  display: flex;
  justify-content: flex-end;
}

.recommend-container .tab-container .tab-bar .item {
  font-size: 15px;
  color: gray;
  margin-right: 20px;
  cursor: pointer;
}

.recommend-container .tab-container .tab-bar .item.active {
  color: #ee0000;
}

.recommend-container .tab-container .tab-content {
  margin-top: 20px;
}

.recommend-container .tab-container .tab-content .items {
  display: flex;
  flex-wrap: wrap;
}

.recommend-container .tab-container .tab-content .items .item {
  width: 200px;
  margin: 10px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.recommend-container .tab-container .tab-content .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.recommend-container .tab-container .tab-content .items .item .num-wrap {
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

.recommend-container .tab-container .tab-content .items .item:hover .num-wrap {
  top: 0;
}

.recommend-container .tab-container .tab-content .items .item .img-wrap {
  position: relative;
}

.recommend-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap
  .el-icon-video-play {
  position: absolute;
  right: 10px;
  bottom: 13px;
  width: 40px;
  height: 40px;
  color: #ee0000;
  font-size: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.recommend-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap
  .el-icon-video-play::before {
  transform: translateX(3px);
}

.recommend-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap:hover
  .el-icon-video-play {
  opacity: 1;
}

.recommend-container .tab-container .tab-content .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 14px;
}
</style>
