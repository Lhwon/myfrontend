<template>
  <v-container fluid fill-height align-start ma-0 pa-0 pt-0>
    <v-row no-gutters class="stepper-item-col-height powerForecast">
      <template v-if="dashboard">
        <v-col cols="4" class="pa-3">
          <v-col class="dashboardTitle">
            예측현황
          </v-col>
          <v-row
            class="ma-0 overflow-y-auto plantMain-col-height"
            style="min-height: 360px;"
          >
            <template>
              <v-col cols="6"
                v-for="(plant, id) in powerPlantTotal"
                :key="id"
                class="ma-0 pa-2"             
              >
                <v-card
                  color="card_bg"
                  style="border-radius: 5px;"
                >
                  <v-col cols="12" class="pa-0 plantIcon">
                    <v-card-title
                      class="pa-1 pl-3"
                      @click="plantName(plant)"
                    >
                      {{ plant.powerPlant }}
                    </v-card-title>
                    <template v-if="plant.totalBidAmount !== 0" >
                      <v-col class="ma-0 pa-0 pr-3" style="text-align: right;">
                        <v-badge 
                          :content="plant.totalBidAmount" 
                          color="error"
                          bordered
                          offset-x="15"
                          offset-y="20"
                        >
                          <v-icon 
                          color="error" 
                          class="pa-2"
                          large
                          >
                            mdi-alert-box
                          </v-icon>
                        </v-badge>
                      </v-col>
                    </template>
                  </v-col>
                  <v-row class="px-3 pb-3">
                    <v-col cols="4" class="pa-0">
                      <v-row>
                        <v-col class="ma-0 pa-0">
                          <echart
                          :style="powerLiquid[id].style"
                          :ref="powerLiquid[id].ref"
                          :options="powerLiquid[id].option"
                          class="ma-0 pr-2"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="8" class="pa-0">
                      <v-row 
                        class="py-2 powerForecastDataCard" 
                        style="border-radius: 5px; background-color: white;"
                      >
                        <v-col 
                          cols="12"
                          v-for="(test, k) in plant.totalAmount"
                          :key="k"
                          class="px-2 py-0"
                        >
                          <span>{{ test.name + " : " }}</span>
                          <span>{{ test.value }}GW</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </template>
          </v-row>
          <v-col
            class="pa-0 overflow-y-auto plantUnit-col-height"
            style="background-color: #BDBDBD;"
          >
            <transition name="slideUp">
              <v-row v-if="show">
                <template>
                  <v-col cols="6"
                    v-for="(item, i) in unitData"
                    :key="i"
                    class="ma-0 pa-2"  
                  >
                    <template>
                      <v-card
                        color="card_bg"
                        style="border-radius: 5px;"
                      >
                        <v-col 
                          cols="12" 
                          class="pa-0 unitIcon"
                        >
                          <v-card-title
                            class="pa-1 pl-3" 
                            style="font-size: 18px"
                          >
                            {{ item.name }}
                          </v-card-title>
                          <template v-if="item.bidAmount">
                            <v-col 
                              class="ma-0 pa-0"
                              style="text-align: right;"
                            >
                              <v-icon 
                                style="color: red;" 
                                class="pa-2"
                              >
                                mdi-alert
                              </v-icon>
                            </v-col> 
                          </template>
                        </v-col>
                        <v-row class="px-2 pb-2">
                          <v-col cols="4" class="pa-0">
                            <v-row>
                              <v-col class="ma-0 pa-0">
                                <echart
                                  :style="forecastLiquid[i].style"
                                  :ref="forecastLiquid[i].ref"
                                  :options="forecastLiquid[i].option"
                                  class="ma-0 pr-2"
                                />
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="8" class="pa-0">
                            <v-row 
                              class="pa-1 pl-3 powerForecastDataCard" style="border-radius: 5px;background-color: white;"
                            >
                              <v-col cols="12"
                                v-for="(amount, j) in item.amount" 
                                :key="j"
                                class="px-2 py-0"
                              >
                                <span>{{ amount.name + " : " }}</span>
                                <span>{{ amount.value }}GW</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card>
                    </template>
                  </v-col>
                </template>
              </v-row>
            </transition>
          </v-col>
        </v-col>
        <!-- 전국 발전소 현황 -->
        <v-col cols="4" class="pa-3">
          <v-col class="dashboardTitle">
            전국발전소 현황
          </v-col>
          <v-col class="powerMap">
            <v-img class="powerMapImg" :src="require(`@/assets/bg/khnpPowerMap1.png`)" ref="mapImg">
              <!-- <v-icon class="marker marker2" @click="handleMarker('B', $event)">mdi-map-marker</v-icon> -->
              <v-tooltip bottom
                v-for="(marker, i) in powerPlantTotal"
                :key="i"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    size="30"
                    class="marker"
                    @click="handleMarker(i, $event)"
                    :style="statePower !== i ? marker.location : marker.location + 'scale(1.3); color:red;'"
                    v-on="on"
                  >
                    mdi-map-marker
                  </v-icon>
                </template>
                <span>{{ marker.powerPlant }}</span>
              </v-tooltip>
            </v-img>
          </v-col>
        </v-col>
        <v-col cols="4" class="pa-3 powerDetail">
        <!-- <template v-else> -->
          <v-container class="ma-0 pa-0 overflow-y-auto" transition="scroll-x-reverse-transition">
            <v-col v-for="intro in introData" :key="intro.index" cols="12" class="pa-0">
              <v-col cols="12">
                <v-col>
                  <h3>{{intro.title}}</h3>
                </v-col>
                <v-col>
                  <span>{{intro.text}}</span>
                </v-col>
              </v-col>
              <v-col cols="12">
                <v-card class="card_bg" max-width="1300">
                  <v-card-text>
                    <v-col>
                      <h4 class="tip_color">{{intro.tip}}</h4>
                    </v-col>
                    <v-col>
                      <span>{{intro.tipText1}}</span>
                    </v-col>
                    <v-col v-if="intro.tipText2 != null">
                      <span>{{intro.tipText2}}</span>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-col>
            <template v-if="forecastData.length !== 0">
              <v-navigation-drawer
              v-model="isMarker"
              right
              fixed
              width="33.3%"
              floating
              class="powerDetailInfo"
            >
              <v-col class="dashboardTitle">
                {{ forecastData.name }} 현황
              </v-col>
              <v-row class="card_bg">
                <v-col cols="3">
                  <v-icon>{{ forecastData.weatherIcon }}</v-icon> {{ forecastData.weather }}
                </v-col>
                <v-col cols="4">
                  {{ forecastData.tumidity }}/{{ forecastData.temperature }}
                </v-col>
                <v-col cols="5">
                  {{nowDate}}({{ nowWeek }}) {{nowTime}}
                </v-col>
              </v-row>
              <v-col class="chart-col-height">
                <v-col class="pa-0 forecastData">
                  <echart
                  :style="powerData.style"
                  :ref="powerData.ref"
                  :options="powerData.option"
                  class="ma-2"
                  />
                </v-col>
                <v-col class="pa-0 forecastData">
                  <echart
                    :style="weatherData.style"
                    :ref="weatherData.ref"
                    :options="weatherData.option"
                    class="ma-2"
                  />
                </v-col>
                <v-col class="pa-0 forecastData">
                  <!-- <DxPivotGrid
                    id="pivotgrid"
                    ref="grid"
                    :data-source="dataSource"
                    :allow-sorting-by-summary="true"
                    :allow-filtering="true"
                    :show-borders="true"
                    :show-column-grand-totals="false"
                    :show-row-grand-totals="false"
                    :show-row-totals="false"
                    :show-column-totals="false"
                  >
                  <DxFieldChooser
                    :enabled="true"
                    :height="400"
                  />
                  </DxPivotGrid> -->
                </v-col>
                <v-col>
                  <v-btn
                  block
                  elevation="2"
                  x-large
                  @click="dashboard = false"
                >
                  상세내용 조회
                </v-btn>
                </v-col>
              </v-col>
              </v-navigation-drawer> 
            </template>

          </v-container>
        </v-col>
      </template>
      <template v-else>
        <dataForecastAnalysis 
          :forecastData="forecastData"
          @isHome="handleDashboard"
        />
      </template>
    </v-row>
  </v-container>
</template>

<script>
import echart from './ECharts.vue' // echart 컴포넌트
// import {
//   DxPivotGrid,
//   DxFieldChooser,
// } from 'devextreme-vue/pivot-grid'
import DataForecastAnalysis from './forecastComp/DataForecastAnalysis.vue'

import powerPlantData from './forecastComp/powerForecastData/powerPlantData' // 전국 발전소 송전량 예측현황 데이터
import powerForecast1 from './forecastComp/powerForecastData/powerForecast1.json' // A 데이터
import powerForecast2 from './forecastComp/powerForecastData/powerForecast2.json' // B 데이터
import powerForecast3 from './forecastComp/powerForecastData/powerForecast3.json' // C 데이터

import 'echarts-liquidfill'


export default {
  name: 'powerForecast',
  components: {
    echart,
    // DxPivotGrid,
    // DxFieldChooser,
    DataForecastAnalysis,
  },
  data() {
    return {
      stateMarker: false, 
      errorCount: 2,
      statePower: '',
      isMarker: false,
      forecastData: [], // 각 발전소 데이터
      dashboard: true,
      powerData: {
        style: 'height:90%; width:90%; marginLeft: auto !important; marginRight: auto !important;',
        ref: '',
        option: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['발전량', '송전량', '예측량', '입찰량']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          // 발전량 데이터
          series: []
        },
      },
      weatherData: {
        style: 'height:90%; width:90%; marginLeft: auto !important; marginRight: auto !important;',
        ref: '',
        option: {
          title: {
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['파고', '기온', '기압', '수온', '풍속']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: []
        },
      },
      introData: [
        {
          index: 0,
          title: '빅데이터 분석',
          text: '빅데이터 분석 및 시각화를 많은 양의 데이터를 한눈에 볼 수 있고, 정확한 분석 결과를 도출합니다.',
          tip: 'TIP! 누구나 이용가능해요!',
          tipText1: '데이터를 활용하여 누구나 원하는 통계를 찾을 수 있어요.',
          tipText2: null
        },
        {
          index: 1,
          title: '빅데이터 목록',
          text: '분석 대상을 선택해주세요.',
          tip: 'TIP! 검색하려면?',
          tipText1: '하나! 행과 열을 변경하며 원하는 데이터를 검색해보세요.',
          tipText2: '둘! 데이터 필터를 통해서 보고싶은 항목만 봐요.'
        }
      ],
      powerPlantData: [], //발전소 송전량 예측 데이터
      powerPlantTotal: [],
      unitData: [], // 호기 데이터
      powerLiquid: [], // 발전소 Liquid차트
      forecastLiquid: [], // 호기 Liquid차트,
      show: false, // 발전소 선택 시 호기 데이터 출력 애니메이션
      timer: null,
      nowDate: '', // 현재 날짜
      nowTime: '', // 현재 시간
      nowWeek: '' // 현재 요일
    }
  },
  created() {
    // this.timer = setInterval(() => {
    //   this.setNowTimes()
    // }, 1000)
  },
  mounted() {
    this.handleMount()
  },
  methods: {
    handleMarker(power) {
      this.isMarker = false
      if(power !== this.statePower) {
        this.forecastData = []
        this.statePower = power
        setTimeout(() => {
          this.isMarker = true
        }, 200);
        if(power === 0) {
          this.forecastData = powerForecast1
        } else if (power === 1) {
          this.forecastData = powerForecast2
        } else if ( power === 2 ) {
          this.forecastData = powerForecast3
        }
        this.powerData.option.series = this.forecastData.chart1
        this.weatherData.option.series = this.forecastData.chart2
      } else {
        this.statePower = ''
        setTimeout(() => {
          this.forecastData = []
        }, 200);
      }
      this.setNowTimes()
    },
    handleDashboard() {
      this.dashboard = true
    },
    plantName(plant) {
      this.show = false
      setTimeout(() => {
        this.show = true
      }, 100);
      this.forecastLiquid = []
      this.unitData = plant.unit

      for(let sub of this.unitData) {
        this.handleLiquidChart(sub.name, sub.liquidData, this.forecastLiquid)
      }
    },
    handleMount() {
      this.powerLiquid = []
      this.powerPlantTotal = powerPlantData

      for(let el of this.powerPlantTotal) {
        this.handleUnitAlert(el)
        this.handleLiquidChart(el.powerPlant, el.totalLiquidData, this.powerLiquid)
      }
    },
    handleLiquidChart(name, data, chartArray) {
      let chart = {
        style: 'height: 100%; width:100%; ',
        ref: name + ' 리퀴드 차트',
        option: {
          series: [
            {
              type: 'liquidFill',
              data: [data],
              shape: 'path://M36.7,70.3L36.7,70.3h33.1H75v-3.4h-3.5V42.5c0-0.7-0.4-1.2-1-1.5c-0.6-0.3-1.3-0.2-1.8,0.2L55,52.6l-0.1-10.1   c0-0.6-0.4-1.2-0.9-1.5c-0.6-0.3-1.2-0.2-1.8,0.2L38.4,51.5V33.2c0-0.9-0.8-1.7-1.7-1.7h-8.3c-0.9,0-1.6,0.6-1.7,1.5l-4,33.9h-3.4   v3.4h4.9H36.7z"/><path d="M31.4,30.4c0.2,0.1,0.4,0.1,0.6,0.1c0.8,0,1.5-0.5,1.8-1.3c1.4-4.2,5.6-4.8,8.7-4.1c5.4,1.3,10.2,1.8,14-5.5   c0.5-0.9,0.1-2.1-0.8-2.5c-0.9-0.5-2.1-0.1-2.5,0.8c-2.4,4.6-4.3,4.9-9.8,3.6c-5-1.2-11,0.4-13.1,6.5C29.9,29,30.4,30.1,31.4,30.4z',
              backgroundStyle: {
                color: 'gray'
              },
              label: {
                fontSize: 25,
              },
              outline: {
                show: false
              }
            }
          ]
        }
      }
      chartArray.push(chart)
    },
    handleUnitAlert(plant) {
      plant.totalBidAmount = 0
      for(let unit of plant.unit) {
        if(Number(unit.amount[3].value) > 2) {
            unit.bidAmount = true
            plant.totalBidAmount += 1
        }
      }
    },

    setNowTimes() {
      let myDate = new Date(); 

      let yy = String(myDate.getFullYear());  // 연도
      let mm = myDate.getMonth() + 1; // 월
      let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()); // 일
      
      let hh = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours());
      let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes());
      let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds());
      
      let wk = myDate.getDay(); // 요일
      let weeks = ['일', '월', '화', '수', '목', '금', '토',]
      let week = weeks[wk]
      
      this.nowDate = yy + '-' + mm + '-' + dd;
      this.nowTime = hh + ':' + min + ':' + sec;
      this.nowWeek = week
    }

  }
}
</script>

<style lang="scss" scoped>
$appBarHeight: 70px;
$paddingHeight: 8px;

.stepper-item-col-height {
  height: 100vh;
  max-height: calc(100vh - (#{$appBarHeight} + (#{$paddingHeight} * 6)));
}
.chart-col-height {
  height: 100vh;
  max-height: calc(100vh - (#{$appBarHeight} + (#{$paddingHeight} * 20)));
  min-height: 600px;
  // overflow-y: auto;
  overflow: hidden;
}
.plantUnit-col-height {
  height: 100vh;
  max-height: calc(100vh - (#{$appBarHeight} + (#{$paddingHeight} * 59)));
}
.plantMain-col-height {
  height: 100vh;
  max-height: calc(100vh - (#{$appBarHeight} + (#{$paddingHeight} * 70)));
}
.marker:hover {
  color: red;
}
.marker::after {
  background-color: transparent;
}
.plantIcon {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.plantIcon > div:hover {
  color: gray;
  cursor: pointer;
}
.unitIcon {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

// Transition Animation
.slideUp-enter {
  opacity: 0;
}
.slideUp-enter-active,
.slideUp-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.slideUp-leave-to {
  opacity: 0;
}

.dashboardTitle {
  text-align: center;
  color:white;
  background-color: #124786;
}

// .slideUp-fade-enter {
//   opacity: 0;
// }

</style>