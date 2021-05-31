<template>
  <div class="mv-container">
    <div class="filter-wrap">
      <div class="section-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              :class="['title', { active: area == '全部' }]"
              @click="area = '全部'"
              >全部</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: area == '内地' }]"
              @click="area = '内地'"
              >内地</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: area == '港台' }]"
              @click="area = '港台'"
              >港台</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: area == '欧美' }]"
              @click="area = '欧美'"
              >欧美</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: area == '日本' }]"
              @click="area = '日本'"
              >日本</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: area == '韩国' }]"
              @click="area = '韩国'"
              >韩国</span
            >
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              :class="['title', { active: type == '全部' }]"
              @click="type = '全部'"
              >全部</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: type == '官方版' }]"
              @click="type = '官方版'"
              >官方版</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: type == '原声' }]"
              @click="type = '原声'"
              >原声</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: type == '现场版' }]"
              @click="type = '现场版'"
              >现场版</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: type == '网易出品' }]"
              @click="type = '网易出品'"
              >网易出品</span
            >
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              :class="['title', { active: order == '上升最快' }]"
              @click="order = '上升最快'"
              >上升最快</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: order == '最热' }]"
              @click="order = '最热'"
              >最热</span
            >
          </li>
          <li class="tab">
            <span
              :class="['title', { active: order == '最新' }]"
              @click="order = '最新'"
              >最新</span
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="mvs">
      <div class="items">
        <div
          class="item"
          v-for="(item, index) in lists"
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
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'LatestMV',
  data: function () {
    return {
      page: 1,
      total: 0,
      lists: [],
      limit: 8,
      area: '全部',
      type: '全部',
      order: '上升最快'
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getList()
    },
    getList () {
      axios({
        url: 'https://autumnfish.cn/mv/all',
        method: 'get',
        params: {
          area: this.area,
          type: this.type,
          order: this.order,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then((res) => {
        console.log(res)
        this.lists = res.data.data
        this.total = res.data.count
        for (let i = 0; i < this.lists.length; i++) {
          if (this.lists[i].playCount > 10000) {
            this.lists[i].playCount =
              parseInt(this.lists[i].playCount / 10000) + '万'
          }
        }
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
    toMvList (id) {
      this.$router.push('/mvlist?id=' + id)
    }
  },
  watch: {
    area () {
      this.getList()
    },
    type () {
      this.getList()
    },
    order () {
      this.getList()
    }
  },
  created () {
    // 获取数据
    this.getList()
  }
}
</script>
<style scoped>
.mv-container {
  margin-left: 40px;
}
.mv-container .filter-wrap > div {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.mv-container .filter-wrap > div ul {
  display: flex;
}

.mv-container .filter-wrap > div span {
  font-size: 14px;
  height: 100%;
}

.mv-container .filter-wrap > div span.title {
  margin: 20px;
  color: gray;
  cursor: pointer;
  padding: 5px 20px;
}

.mv-container .filter-wrap > div span.title.active {
  color: #ee0000;
  background-color: #fcf6f5;
  border-radius: 20px;
}

.mv-container .filter-wrap > div ul li:not(:last-child) {
  border-right: 1px solid #9ca0a09a;
}

.mv-container .mvs .items {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-content: center;
}

.mv-container .mvs .items .item {
  width: 250px;
  cursor: pointer;
  margin-right: 30px;
  margin-bottom: 30px;
}

.mv-container .mvs .items .item .img-wrap {
  width: 100%;
  position: relative;
}

.mv-container .mvs .items .item .img-wrap > img {
  width: 100%;
}

.mv-container .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  display: flex;
  align-content: center;
  padding-right: 6px;
  padding-top: 6px;
}

.mv-container .mvs .items .item .img-wrap .num-wrap .el-icon-video-play {
  margin-right: 3px;
  margin-top: 3px;
}

.mv-container .mvs .items .item .img-wrap .duration {
  color: white;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 6px;
  margin-right: 4px;
}

.mv-container .mvs .items .item .info-wrap .name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 15px;
}
.mv-container .mvs .items .item .info-wrap .singer {
  color: rgb(128, 128, 128);
  font-size: 15px;
}
</style>
