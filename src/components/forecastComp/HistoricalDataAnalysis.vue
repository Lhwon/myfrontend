<template>
  <v-container>
    <v-row>
      <v-col
        cols="6"
        class="chart-col-height"
      >
        <v-col class="ma-2" style="height: 300px; border: 1px solid gray;">
          <echart
            :style="historicalPower.style"
            :ref="historicalPower.ref"
            :options="historicalPower.option"
            class="ma-2"
          />
        </v-col>
        <v-col class="ma-2" style="height: 300px; border: 1px solid gray;">
          <echart
          :style="historicalWeather.style"
          :ref="historicalWeather.ref"
          :options="historicalWeather.option"
          class="ma-2"
        />
        </v-col>
      </v-col>
      <!-- <v-col 
        cols="6" 
        class="chart-col-height"
      >
        <DxPivotGrid
          :allow-sorting-by-summary="true"
          :allow-sorting="true"
          :allow-filtering="true"
          :allow-expand-all="true"
          :height="440"
          :show-borders="true"
          :show-column-grand-totals="false"
          :show-row-grand-totals="false"
          :show-row-totals="false"
          :show-column-totals="false"
          :data-source="dataSource"
        >
          <DxFieldChooser :enabled="false"/>
        </DxPivotGrid>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import echart from '../ECharts.vue' 

// import {
//   DxPivotGrid,
//   DxFieldChooser,
// } from 'devextreme-vue/pivot-grid'


export default {
  name: 'historicalDataAnalysis',
  components: {
    echart,
    // DxPivotGrid,
    // DxFieldChooser,
  },
  props: {
    detailData : Object,
  },
  data() {
    return {
      historicalPower: [], // 과거 발전량 차트
      historicalWeather: [], // 과거 날씨 차트
      dataSource: [], // 그리드 데이터소스
    }
  },
  watch: {
    detailData: {
      handler(e) {
        console.log("watch :",e)
        this.createChart()
        this.createGrid()
      },
      deep: true
    }
  },
  created() {
    this.createChart()
    this.createGrid()

    // console.log("데이터 확인", this.detailData.powerGrid)
  },
  methods: {
    // 차트 구현
    createChart() {
      let chart = {
        style: 'height:100%; width:100%; marginLeft: auto !important; marginRight: auto !important;',
        ref: '',
        option: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: []
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
        }
      }
      // historical Power차트 데이터 생성
      this.historicalPower = JSON.parse(JSON.stringify(chart))
      this.historicalPower.ref = "historicalPower"
      this.historicalPower.option.legend.data = ['송전량', '예측량', '입찰량']
      this.historicalPower.option.series = this.detailData.powerChart
      // historical Weatehr차트 데이터 생성
      this.historicalWeather = JSON.parse(JSON.stringify(chart))
      this.historicalWeather.ref = "historicalWeather"
      this.historicalWeather.option.legend.data = ['파고', '기온', '기압', '수온', '풍속']
      this.historicalWeather.option.series = this.detailData.weatherChart
    },
    createGrid() {
      this.dataSource = {
        fields: [
          {
            caption: 'date',
            width: 120,
            dataField: 'date',
            area: 'row',
          },
          {
            caption: 'time',
            dataField: 'time',
            width: 100,
            area: 'row',

          },
          {
            caption: 'bidAmount',
            dataField: 'bidAmount',
            area: 'column',
          },
          {
            caption: 'forecastAmount',
            dataField: 'forecastAmount',
            area: 'column',
          },
          {
            caption: 'Sales',
            dataField: 'amount',
            dataType: 'number',
            summaryType: 'sum',
            area: 'data',
          },
        ],
        store: this.detailData.powerGrid,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$appBarHeight: 70px;
$paddingHeight: 8px;

.stepper-item-col-height {
  height: 100vh;
  max-height: calc(100vh - (#{$appBarHeight} + (#{$paddingHeight} * -6)));
}
.chart-col-height {
  height: 100vh;
  max-height: calc(100vh - (#{$appBarHeight} + (#{$paddingHeight} * 20)));
  min-height: 600px;
  // overflow-y: auto;
  overflow: hidden;
}
</style>