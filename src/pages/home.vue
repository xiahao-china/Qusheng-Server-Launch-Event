<template>
  <div class="home-shell">
    <div class="home-root" :class="['app_container', 'app_container_' + pageType]">
      <div class="app_container_top">
        <img
            @click="isShowMenu = !isShowMenu"
            src="../assets/ICON_更多@3x.png"
            style="width: 40.9988px; height: 40.9988px"
        />
        <div class="app_container_menu_box" v-if="isShowMenu">
          <div class="app_container_menu">
            <div class="bt" @click="menuClick('1')">游戏规则</div>
            <div class="bt" @click="menuClick('2')">活动记录</div>
            <div class="bt" @click="menuClick('3')">全服记录</div>
            <div @click="menuClick('4')">好运值规则</div>
          </div>
        </div>
      </div>
      <div class="default">
        <div :class="[pageType === 'xy' ? 'active' : '']" @click="operate('xy')">
          幸运转盘
        </div>
        <div :class="[pageType === 'hy' ? 'active' : '']" @click="operate('hy')">
          好运转盘
        </div>
        <div :class="[pageType === 'my' ? 'active' : '']" @click="operate('my')">
          命运转盘
        </div>
      </div>
      <div class="app_container_tg">
        <van-switch
            v-model="checked"
            size="16.0013px"
            active-color="#68D36F"
            inactive-color="#0F0F0F"
        />
        <div>跳过动画</div>
      </div>
      <div :class="['home_container', 'home_active_' + pageType]" v-if="size" >
        <div class="chose-bg-shell">
          <img class="chose-bg" src="../assets/幸运转盘转向卡.png"/>
        </div>
        <div class="shine-gift" v-if="tipPrize"/>
        <van-circle
            class="progress"
            v-model:current-rate="progressInfo.currentValue"
            :rate="progressInfo.progressVal"
            :speed="100"
            :size="progressSize"
            layer-color="none"
            text=""
            :color="{
              '0%': '#C71585',    // 深粉红色，作为起始颜色
              '10%': '#DB4387',    // 深紫红色，增加深度感
              '20%': '#E96EA8',    // 柔和的粉红色
              '30%': '#F17CBA',    // 较浅的粉红色，开始过渡到亮色
              '40%': '#F8A5C2',    // 亮粉红色
              '50%': '#FBC0EB',    // 亮粉红色，渐变的中间点
              '60%': '#FDC4E2',    // 更亮的粉红色，增加活力
              '70%': '#FED8E7',    // 带有一点白色的粉红色，增加温暖感
              '80%': '#FEEDF0',    // 非常浅的粉红色，接近白色
              '90%': '#FFF1F5',    // 接近白色的粉红色，增加柔和感
              '100%': '#FFF6F9'    // 最浅的粉红色，作为结束颜色
            }"
            :stroke-width="progressColorSize"
        />
        <div class="level-tip">好运值<span>LV.{{ progressInfo.level }}</span></div>
        <LuckyGrid
            class="lucky-grid"
            ref="myLucky"
            :width="size"
            :height="size"
            :rows="z"
            :cols="z"
            :prizes="prizes"
            :blocks="blocks"
            :buttons="buttons"
            :activeStyle="activeStyle"
            :defaultConfig="{
              accelerationTime: 300,
              speed: 4,
              decelerationTime: 4000,
              offsetDegree: 15,
            }"
            @start="debouncedStartCallback"
            @end="endCallback"
        />
      </div>
      <div class="zs">
        <img src="../assets/钻石@1x.png" alt=""/>
        <div class="zs-num">{{ zsNum }}</div>
      </div>
      <div class="footer">
        <div
            :class="['footer_item', pageNumber == '1' ? 'footer_active' : '']"
            @click="pageNumber = 1"
        >
          <div v-if="isFirstDraw" class="first-draw">
            <div class="text">首抽必赚</div>
          </div>
          <div>
            <img src="../assets/金币.png" alt=""/>
            <div>{{ config.price1 }}</div>
          </div>
          <div>{{ config.name1 }}</div>
        </div>
        <div
            :class="['footer_item', pageNumber == '10' ? 'footer_active' : '']"
            @click="pageNumber = 10"
        >
          <div>
            <img src="../assets/金币.png" alt=""/>
            <div>{{ config.price2 }}</div>
          </div>
          <div>{{ config.name2 }}</div>
        </div>
        <div
            :class="['footer_item', pageNumber == '50' ? 'footer_active' : '']"
            @click="pageNumber = 50"
        >
          <div>
            <img src="../assets/金币.png" alt=""/>
            <div>{{ config.price3 }}</div>
          </div>
          <div>{{ config.name3 }}</div>
        </div>
      </div>

      <div class="dialog_box" v-if="isSMShow">
        <div class="dialog_1">
          <div class="sm"><img src="../assets/活动说明top.png" alt=""/></div>
          <div class="gb" @click="isSMShow = !isSMShow">
            <img src="../assets/ICON_关闭.png" alt=""/>
          </div>
          <div class="dialog_1_text_xy">
            <div v-html="argeementValue"></div>
            <!-- <div>1.参与命运齿轮游戏，请选择转动次数，再点击”开始"</div>
            <div>2.每次启动时空之轮100%获得礼物奖励</div>
            <div>3.获得的道具在礼物界面背包中查看</div>
            <div>4.如有疑问请联系平台客服咨询</div>
            <div>
              5.该活动仅供互动娱乐，用户通过活动获取奖励仅限在平台内消耗使用，禁止一切线下交易和返现等不正当行为，严厉打击买卖虚拟物品等行为，用户的任何私下交易行为需自行承担不利后果
            </div>
            <div>
              6.平台坚决打击一切网络赌博、变相网络赌博行为，非平台官方渠道充值、代充、买卖虚拟物品、通过活动实施的任何影响互动公平性、利用产品BUG等不正当手段参与活动等行为均为禁止行为，经发现后平
            </div> -->
          </div>
        </div>
      </div>

      <div class="dialog_box" v-if="isTipShow">
        <div class="dialog_1">
          <div class="gb" @click="isTipShow = !isTipShow">
            <img src="../assets/ICON_关闭.png" alt=""/>
          </div>
          <div class="dialog_1_text_xy info-img-shell">
<!--            <div v-html="argeementValue"></div>-->
            <img class="info-img" src="../assets/info.jpg"/>
          </div>
        </div>
      </div>

      <div class="dialog_box" v-if="isQFShow">
        <div class="dialog_1">
          <div class="sm"><img src="../assets/全服记录TOP.png" alt=""/></div>
          <div class="gb" @click="isQFShow = !isQFShow">
            <img src="../assets/ICON_关闭.png" alt=""/>
          </div>
          <div class="dialog_1_text">
            <div class="scroll_header">
              <div>获得礼物</div>
              <div>数量</div>
              <div>时间</div>
            </div>
            <div class="dialog_1_text_scroll" @scroll="handleScroll">
              <div
                  class="scroll_item"
                  v-for="(item, index) in qfjlList"
                  :key="index"
              >
                <div>{{ item.gname }}</div>
                <div
                    style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
                >
                  <img
                      :src="item.headimg"
                      alt=""
                      style="width: 30%; height: 60%; margin-right: 5px"
                  />
                  <div>x{{ item.num }}</div>
                </div>
                <div>{{ item.time }}</div>
              </div>
              <div v-if="loading" class="loading">加载中...</div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog_box" v-if="isSWDhow">
        <div class="dialog_1">
          <div class="sm"><img src="../assets/全服记录TOP(1).png" alt=""/></div>
          <div class="gb" @click="isSWDhow = !isSWDhow">
            <img src="../assets/ICON_关闭.png" alt=""/>
          </div>
          <div class="dialog_1_text">
            <div class="scroll_header">
              <div class="item_tx">头像</div>
              <div class="item_nc">昵称</div>
              <div class="item_lw">礼物/时间</div>
              <div class="item_sl">数量</div>
            </div>
            <div class="dialog_1_text_scroll" @scroll="handleScrollAll">
              <div
                  class="scroll_item"
                  v-for="(item, index) in qfjlListAll"
                  :key="index"
              >
                <div
                    class="item_tx"
                    style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
                >
                  <img :src="item.headimg" alt="" srcset="" style="width: 35px"/>
                </div>
                <div class="item_nc">{{ item.nickname }}</div>

                <div class="item_lw_value">
                  <div>
                    <div class="value_title">
                      {{ item.gname }}
                    </div>
                    <div class="value_time">{{ item.time }}</div>
                  </div>
                </div>
                <div class="item_sl">x{{ item.num }}</div>
              </div>
              <div v-if="loadingAll" class="loading">加载中...</div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog_box" v-if="isZJShow">
        <div class="dialog_1">
          <div class="sm"><img src="../assets/我的记录top@3x.png" alt=""/></div>
          <div class="gb" @click="isZJShow = !isZJShow">
            <img src="../assets/ICON_关闭.png" alt=""/>
          </div>
          <div class="dialog_1_text_zj">
            <div class="zj_box">
              <div class="zj_box_item_shell" v-for="item in zjjlData.dataList">
                <div :class="['zj_box_item', 'zj_box_item_' + item['bq']]">
                  <img :src="item['gimg']" alt="" srcset=""/>
                  <div>{{ item["gname"] }}</div>
                  <div>{{ item.price }}钻石*{{ item.num }}</div>
                </div>
                <div class="tag" v-if="item.isLucky">好运礼</div>
              </div>
            </div>
            <div class="zj_footer">
              总价值{{ zjjlData.zsTotal }}钻石，总礼物数：{{ zjjlData.lwTotal }}个
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {reactive} from "vue";
import {showToast, Circle} from "vant";
import {debounce} from "lodash";
import {
  getUrlParams,
  prizeImg,
  getPageTypeImg, getImgInfo, getFontsInfo, rotateEl
} from "@/pages/const.js";

const router = useRouter();
// let apptoken = ref('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1YjM2ZmZmODNjMWU0NjFkOTZhZGM5NmI2NDAxZWU3OSJ9.qtU3mwmKzCYH_gzTQ6AB_SGQnq-UPDKvJ2xad-s1_a0')
let apptoken = ref(getUrlParams().token);
const z = 60, // 格子细分数
    s = 12, // 格子大小
    m = 18, // y 轴偏移量
    n = 9, // x 轴偏移量
    k = 2.8; // 按钮放大的倍数
const pageType = ref("xy");
const checked = ref(false);
const blocks = [];
const isShowMenu = ref(false);

const resultList = ref([]);
const prizes = computed(() => {
  const itemImg = getPageTypeImg(pageType.value);
  return [
    {
      x: z / 2 - s / 2,
      y: 0,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 0, itemImg),
      fonts: getFontsInfo(resultList.value, 0),
    },
    {
      x: z - m - s / 2,
      y: n - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 1, itemImg),
      fonts: getFontsInfo(resultList.value, 1),
    },
    {
      x: z - n - s / 2,
      y: m - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 2, itemImg),
      fonts: getFontsInfo(resultList.value, 2),
    },
    {
      x: z - s,
      y: z / 2 - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 3, itemImg),
      fonts: getFontsInfo(resultList.value, 3),
    },
    {
      x: z - n - s / 2,
      y: z - m - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 4, itemImg),
      fonts: getFontsInfo(resultList.value, 4),
    },
    {
      x: z - m - s / 2,
      y: z - n - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 5, itemImg),
      fonts: getFontsInfo(resultList.value, 5),
    },
    {
      x: z / 2 - s / 2,
      y: z - s,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 6, itemImg),
      fonts: getFontsInfo(resultList.value, 6),
    },
    {
      x: m - s / 2,
      y: z - n - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 7, itemImg),
      fonts: getFontsInfo(resultList.value, 7),
    },
    {
      x: n - s / 2,
      y: z - m - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 8, itemImg),
      fonts: getFontsInfo(resultList.value, 8),
    },
    {
      x: 0,
      y: z / 2 - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 9, itemImg),
      fonts: getFontsInfo(resultList.value, 9),
    },
    {
      x: n - s / 2,
      y: m - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 10, itemImg),
      fonts: getFontsInfo(resultList.value, 10),
    },
    {
      x: m - s / 2,
      y: n - s / 2,
      col: s,
      row: s,
      imgs: getImgInfo(resultList.value, 11, itemImg),
      fonts: getFontsInfo(resultList.value, 11),
    },
  ];
});

const pageNumber = ref("1");
const isSMShow = ref(false);
const isQFShow = ref(false);
const isSWDhow = ref(false);
const isTipShow = ref(false);

const buttons = [
  {
    imgs: [prizeImg],
    background: "rgba(0, 0, 0, 0)",
    radius: '22%',
  },
];
const defaultStyle = {
  borderRadius: Infinity,
  background: "#bac5ee",
};
const activeStyle = {
  background: "#f7cf9f",
};
const myLucky = ref();

const progressInfo = ref({
  level: 1,
  currentValue: 0,
  progressVal: 90,
})
const isFirstDraw = ref(true);

const operate = (type) => {
  pageType.value = type;
  init();
};

let zjjlData = reactive({
  dataList: [],
  zsTotal: 0,
  lwTotal: 0,
});

// 点击抽奖按钮会触发star回调
const startCallback = async () => {
  tipPrize.value = false;
  if (checked.value) {
    const res = await axios({
      url: "http://yyjy.baixun.fun/prod-api/api/v1/v2/xindongxinyuanMhChoujiang",
      method: "post",
      headers: {
        apptoken: apptoken.value,
      },
      data: {
        type: pageType.value == "xy" ? 1 : pageType.value == "hy" ? 2 : 3,
        cishu:
            pageNumber.value == 1 ? "1" : pageNumber.value === 10 ? "2" : "3",
      },
    });
    zjjlData = res.data;
    endCallback();
  } else {
    // 模拟调用接口异步抽奖
    const res = await axios({
      url: "http://yyjy.baixun.fun/prod-api/api/v1/v2/xindongxinyuanMhChoujiang",
      method: "post",
      headers: {
        apptoken: apptoken.value,
      },
      data: {
        type: pageType.value == "xy" ? 1 : pageType.value == "hy" ? 2 : 3,
        cishu:
          pageNumber.value == 1 ? "1" : pageNumber.value === 10 ? "2" : "3",
      },
    });
    if (res.data.code !== 200){
      showToast(res.data.msg);
      myLucky.value.stop(0);
      return
    }
    // 调用抽奖组件的play方法开始游戏
    myLucky.value.play();
    const endIndex = prizes.value.findIndex((e) => e.fonts[0].text === res.data.dataList[0].gname);
    myLucky.value.stop(endIndex);
    zjjlData = res.data;
  }
};

const debouncedStartCallback = debounce(startCallback, 300); // 300ms 的防抖时间可以根据需要调整
const argeementValue = ref("");
const menuClick = async (type) => {
  if (type == 1) {
    isSMShow.value = !isSMShow.value;
    // 模拟异步请求
    const res = await axios({
      url: "http://yyjy.baixun.fun/prod-api/api/v1/display/appAgreement?id=13",
      method: "get",
    });
    argeementValue.value = res.data;
  }
  if (type == 2) {
    isQFShow.value = !isQFShow.value;
    qfjlList.value = [];
    hasMore.value = true;
    loading.value = false;
    page.value = 1;
    page.pageSize = 20;
    fetchData();
  }
  if (type == 3) {
    isSWDhow.value = !isSWDhow.value;
    qfjlList.valueAll = [];
    hasMore.valueAll = true;
    loading.valueAll = false;
    page.valueAll = 1;
    page.pageSizeAll = 20;
    fetchDataAll();
  }
  if (type == 4) {
    isTipShow.value = true;
    qfjlList.valueAll = [];
    hasMore.valueAll = true;
    loading.valueAll = false;
    page.valueAll = 1;
    page.pageSizeAll = 20;
    fetchDataAll();
  }
  isShowMenu.value = !isShowMenu.value;
};
// 抽奖结束会触发end回调
const endCallback = (prize) => {
  // const endIndex = prizes.value.find((e) => e.fonts[0].text === zjjlData.dataList[0].gname);
  tipPrize.value = true;
  if (zjjlData.code === 200) {
    zjjlData.zsTotal = 0;
    zjjlData.lwTotal = 0;
    zjjlData.dataList.forEach((e) => {
      zjjlData.zsTotal += Number(e["price"]);
      zjjlData.lwTotal += Number(e["num"]);
    });
    if (zjjlData.zjlist && Object.keys(zjjlData.zjlist).length > 0){
      zjjlData.dataList.push({
        "giftId": "11111",
        "price": zjjlData.zjlist.price,
        "num": zjjlData.zjlist.num,
        "isp": "",
        "effect": "",
        "buytype": "1",
        "shouliwu": "",
        "time": "",
        "gname": zjjlData.zjlist.name,
        "gimg": zjjlData.zjlist.img,
        "songliwu": "",
        "bq": "",
        isLucky: true
      })
    }
    isZJShow.value = true;
    init();
  } else {
    showToast(zjjlData.msg);
  }
};

const qfjlList = ref([]);
const hasMore = ref(true);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(20);
const tipPrize = ref(false);
const handleScroll = (event) => {
  const {scrollTop, clientHeight, scrollHeight} = event.target;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    fetchData();
  }
};
const fetchData = async () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    // 模拟异步请求
    const response = await fetchPageData(page.value, pageSize.value);
    qfjlList.value = qfjlList.value.concat(response.data);
    hasMore.value = response.hasMore;
    page.value++;
  } catch (error) {
    console.error("获取数据失败", error);
  } finally {
    loading.value = false;
  }
};
const fetchPageData = async (page, pageSize) => {
  // 模拟异步请求
  const res = await axios({
    url: "http://yyjy.baixun.fun/prod-api/api/v1/v2/xindongxinyuanMhRecord",
    method: "post",
    headers: {
      apptoken: apptoken.value,
    },
    data: {
      type: pageType.value == "xy" ? 1 : pageType.value == "hy" ? 2 : 3,
      pageNo: page,
      pageSize: pageSize,
    },
  });
  if (res.data.dataList) {
    return {
      data: res.data.dataList,
      hasMore: page < res.data.totalPage,
    };
  } else {
    return {
      data: [],
      hasMore: false,
    };
  }
};

const qfjlListAll = ref([]);
const hasMoreAll = ref(true);
const loadingAll = ref(false);
const pageAll = ref(1);
const pageSizeAll = ref(10);
const handleScrollAll = (event) => {
  const {scrollTop, clientHeight, scrollHeight} = event.target;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    fetchDataAll();
  }
};
const fetchDataAll = async () => {
  if (loadingAll.value || !hasMoreAll.value) return;
  loadingAll.value = true;
  try {
    // 模拟异步请求
    const response = await fetchPageDataAll(pageAll.value, pageSizeAll.value);
    qfjlListAll.value = qfjlListAll.value.concat(response.data);
    hasMoreAll.value = response.hasMore;
    pageAll.value++;
  } catch (error) {
    console.error("获取数据失败", error);
  } finally {
    loadingAll.value = false;
  }
};
const fetchPageDataAll = async (page, pageSize) => {
  // 模拟异步请求
  const res = await axios({
    url: "http://yyjy.baixun.fun/prod-api/api/v1/v2/xindongxinyuanMhRecord_quanfu",
    method: "post",
    data: {
      type: pageType.value == "xy" ? 1 : pageType.value == "hy" ? 2 : 3,
      pageNo: page,
      pageSize: pageSize,
    },
  });
  if (res.data.dataList) {
    return {
      data: res.data.dataList,
      hasMore: page < res.data.totalPage,
    };
  } else {
    return {
      data: [],
      hasMore: false,
    };
  }
};
const config = ref({
  name1: "抽1次",
  name2: "抽10次",
  name3: "抽50次",
  price1: "20.00",
  price2: "200.00",
  price3: "1000.00",
});
const init = async () => {
  const res = await axios({
    url: "http://yyjy.baixun.fun/prod-api/api/v1/v2/xindongxinyuanMh",
    method: "post",
    headers: {
      apptoken: apptoken.value,
    },
    data: {
      type: pageType.value == "xy" ? 1 : pageType.value == "hy" ? 2 : 3,
    },
  });
  const prehandleList = res.data.dataList.sort((pre, nxt) => Number(pre.bq) - Number(nxt.bq));
  const handleList = [];
  for (let i=0; i<4; i++) {
    handleList.push(prehandleList[i]);
    handleList.push(prehandleList[i+4]);
    handleList.push(prehandleList[i+8]);
  }

  resultList.value = handleList;

  progressInfo.value.level = res.data.xingyunzhilevel;
  progressInfo.value.progressVal = Number(res.data.xingyunzhi)/Number(res.data.xingyunzhixiaji)  * 100;
  isFirstDraw.value = Boolean(Number(res.data.isshouchou));

  config.value = {
    name1: res.data.name1,
    name2: res.data.name2,
    name3: res.data.name3,
    price1: res.data.price1,
    price2: res.data.price2,
    price3: res.data.price3,
  };
};

const size = ref(0);
const progressSize = ref(0);
const progressColorSize = ref(0);
onMounted(async () => {
  await init();
  // 根据375的尺寸基础对应当前屏幕计算尺寸
  size.value = 340 * (document.body.clientWidth / 375);
  progressSize.value = 163 * (document.body.clientWidth / 375);
  progressColorSize.value = 220 * (document.body.clientWidth / 375);
  const res = await axios({
    url: "http://yyjy.baixun.fun/prod-api/api/v1/getUserInfo",
    method: "post",
    headers: {
      apptoken: apptoken.value,
    },
  });
  if (res.data && res.data.result) {
    zsNum.value = res.data.result.miZuan;
  }
});
const zsNum = ref(0);
const isZJShow = ref(false);
</script>

<style scoped lang="less">
@import "./index.less";
</style>
