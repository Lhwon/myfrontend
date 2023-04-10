<template>
  <v-container fluid fill-height align-start ma-0 pa-2 pt-0>
    <v-col cols="2" 
    class="pa-1 stepper-item-col-height"
    >
      <v-row class="ma-0" style="background-color:#0D47A1">
        <v-col>
          <h3 style="color:white">발전량 예측</h3>
        </v-col>
        <v-col class="homeButton">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon small class="pa-0" v-on="on" color="white" @click="goHome">
                <v-icon size="20">mdi-home</v-icon>
              </v-btn>
            </template>
            <span>대시보드 이동</span>
          </v-tooltip>
        </v-col>        
      </v-row>
      <v-col class="pa-2 stepper-item-col-height" style="background-color:#EEEEEE">
        <v-col
          cols="12"
          class="ma-0 px-0"                 
        >
        <v-card
          color="#BDBDBD"
        >
          <v-card-title 
            class="pa-1 pl-3"
          >
            {{ forecastData.name }}
          </v-card-title>
          <v-row>
            <v-col cols="4" class="pr-0">
              <v-col>
                <echart 
                  :style="liquidDetail.style"
                  :ref="liquidDetail.ref"
                  :options="liquidDetail.option"
                />
              </v-col>
            </v-col>
            <v-col cols="8">
              <v-row class="pa-1" style="border-radius: 5px; background-color: white;">
                <v-col 
                cols="12"
                class="pa-0 pl-2"
                v-for="(data, id) in forecastData.totalAmount"
                :key="id"
                >
                  <span>{{ data.name + " : " }}</span>
                  <span>{{ data.value }}</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-list class="py-4" flat>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in forecastData.children"
            :key="i"
            @click="listData(item.name, forecastData.name)"
            class="ma-2 card_bg"
          >
            <v-card style="width: 100%; backgroundColor: transparent !important;">
              <v-col style="height:70px;">
                {{ item.name }}
              </v-col>
            </v-card>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      </v-col>
    </v-col>
    <v-col cols="10" class="card_bg">
      <!-- 탭 헤더 영역 -->
      <v-col style="text-align: right;" class="pa-0">
        <v-card>
          <v-tabs
            v-model="active_tab"
          >
            <v-tab
              v-for="item in tabs"
              :key="item.tabs"
            >
              {{ item.name }}
            </v-tab>
          </v-tabs>
        </v-card>
      </v-col>
      <!-- 탭 헤더 영역 -->
      <v-col class="pa-0 overflow-y-auto stepper-item-col-height">
        <v-tabs-items v-model="active_tab" class="tapArea">
          <template v-if="nodeSelected">
            <!-- 과거 데이터 분석 -->
            <v-tab-item>
                <historicalDataAnalysis :detailData="viewList"/>
            </v-tab-item>
            <!-- 실시간 송전량 예측 -->
            <v-tab-item>
              <realTransmissionForecast :detailData="viewList"/>
            </v-tab-item>
            <!-- AI 시뮬레이터 -->
            <v-tab-item>
              <dataSimulater :detailData="viewList" @aiMapping="handleAiMapping"/>
            </v-tab-item>
          </template>
        </v-tabs-items>
      </v-col>
    </v-col>
  </v-container>
</template>

<script>
import historicalDataAnalysis from './HistoricalDataAnalysis.vue'
import realTransmissionForecast from './RealTransmissionForecast.vue'
import dataSimulater from './DataSimulater.vue'

import echart from '../ECharts.vue' // echart 컴포넌트
import 'echarts-liquidfill'

export default {
  name: 'ataForecastAnalysis',
  components: {
    historicalDataAnalysis, //과거 데이터 분석 컴포넌트
    realTransmissionForecast, //실시간 송전량 예측 컴포넌트
    dataSimulater, //Ai 시뮬레이터 컴포넌트 
    echart
  },
  data() {
    return {
      active_tab: null,
      tabs: [
        { index: 0, name: '과거 데이터 분석' },
        { index: 1, name: '실시간 송정량 예측' },
        { index: 2, name: 'AI 시뮬레이터' }
      ],
      selectedItem: [],
      listItems: [
        { text: '1호기', type: 'A' },
        { text: '2호기', type: 'A' },
        { text: '3호기', type: 'A' },
      ],
      veiwList: {},
      selectedPowerUnit: '',
      nodeSelected: false,
      liquidDetail: {
        style: 'height: 100%; width:100%;',
        ref: 'liquidShow',
        option: {
          series: [{
            type: 'liquidFill',
            data: [this.forecastData.plaintLiquidData],
            shape: 'path://M36.7,70.3L36.7,70.3h33.1H75v-3.4h-3.5V42.5c0-0.7-0.4-1.2-1-1.5c-0.6-0.3-1.3-0.2-1.8,0.2L55,52.6l-0.1-10.1   c0-0.6-0.4-1.2-0.9-1.5c-0.6-0.3-1.2-0.2-1.8,0.2L38.4,51.5V33.2c0-0.9-0.8-1.7-1.7-1.7h-8.3c-0.9,0-1.6,0.6-1.7,1.5l-4,33.9h-3.4   v3.4h4.9H36.7z"/><path d="M31.4,30.4c0.2,0.1,0.4,0.1,0.6,0.1c0.8,0,1.5-0.5,1.8-1.3c1.4-4.2,5.6-4.8,8.7-4.1c5.4,1.3,10.2,1.8,14-5.5   c0.5-0.9,0.1-2.1-0.8-2.5c-0.9-0.5-2.1-0.1-2.5,0.8c-2.4,4.6-4.3,4.9-9.8,3.6c-5-1.2-11,0.4-13.1,6.5C29.9,29,30.4,30.1,31.4,30.4z',
            backgroundStyle: {
              color: 'white'
            },
            label: {
              fontSize: 25
            },
            outline: {
              show: false
            }
          }]
        }
      }
    }
  },
  props: {
    forecastData: {
      type: Object
    }
  },
  created() {
    console.log("viewList->",this.forecastData)
  },

  methods: {
    listData(name, power) {
      this.selectedPowerUnit = name
      let mapping = []
      let powerChart = [] // 과거 발전량 데이터
      let weatherChart = [] // 과거 날씨 데이터
      let realPowerChart = [] // 실시간 송전량 데이터
      let realWeatherChart = [] // 실시간 송전량 날씨 데이터
      let aiPowerChart = [] // AI 시뮬레이터 발전량 데이터
      let aiForecastChart = [] // AI 시뮬레이터 날씨 데이터
      let powerGrid = [] // 그리드 
      for(let el of this.forecastData.children) {
        if(el.name === this.selectedPowerUnit) {
          mapping = el.aiMapping
          powerChart = el.historicalPowerChart
          weatherChart = el.historicalWeatherChart
          realPowerChart = el.realPowerChart
          realWeatherChart = el.realWeatherChart
          aiPowerChart = el.aiPowerChart
          aiForecastChart = el.aiForecastChart
          powerGrid = el.powerGrid
        }
      }
      if(name.length !== 0 ) {
        this.nodeSelected = true
        this.viewList = {}
        Object.assign(this.viewList, {
          text: name,
          type: power,
          mapping: mapping,
          powerChart: powerChart, // 과거 발전 데이터
          weatherChart: weatherChart, // 과거 날씨 데이터
          realPowerChart: realPowerChart, // 실시간 송전량 데이터
          realWeatherChart: realWeatherChart, // 실시간 송전량 날씨 데이터
          aiPowerChart: aiPowerChart, // AI 시뮬레이터 발전량 데이터
          aiForecastChart: aiForecastChart, // AI 시뮬레이터 예측 데이터
          powerGrid : powerGrid // 그리드
        })
      }
      console.log("그리드 데이터 확인", powerGrid)
    },

    handleAiMapping(param) {
      for(let el of this.forecastData.children) {
        if(el.name === this.selectedPowerUnit) {
          el.aiMapping = param
        }
      }
    },
    goHome() {
      this.$emit('isHome', true)
    },
  }
}

</script>

<style lang="scss" scoped>
$appBarHeight: 70px;
$paddingHeight: 8px;

.stepper-item-col-height {
  height: 100vh;
  max-height: calc(100vh - (#{$appBarHeight} + (#{$paddingHeight} * 15.5)));
}
.tapArea {
  height: 100% !important;
}
.homeButton {
  text-align: right;
}
.v-list-item--active {
  background-color: #0D47A1 !important;
}
</style>