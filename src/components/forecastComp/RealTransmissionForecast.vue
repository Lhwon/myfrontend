<template>
  <v-container>
    <v-row>
      <v-col
        cols="6"
        class="chart-col-height"
      >
        <v-col class="ma-2" style="height: 300px; border: 1px solid grey;">
          <echart
            :style="realPower.style"
            :ref="realPower.ref"
            :options="realPower.option"
            class="ma-2"
          />
        </v-col>
        <v-col class="ma-2" style="height: 300px; border: 1px solid grey;">
          <echart
          :style="realWeather.style"
          :ref="realWeather.ref"
          :options="realWeather.option"
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
  name: 'realTransmissionForecast',
  components: {
    echart,
    // DxPivotGrid,
    // DxFieldChooser
  },

  props: {
    detailData: Object
  },

  data() {
    return {
      realPower: [],
      realWeather: [],
      dataSource: []
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
  },
  
  methods: {
    createChart() {
      let chart1 = {
        style: 'height:90%; width:90%; marginLeft: auto !important; marginRight: auto !important;',
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
      // 실시간 송전량 Power차트 데이터 생성
      this.realPower = JSON.parse(JSON.stringify(chart1))
      this.realPower.ref = "realPower"
      this.realPower.option.legend.data = ['발전량', '송전량', '예측량', '입찰량']
      this.realPower.option.series = this.detailData.realPowerChart

      // 실시간 송전량 Weatehr차트 데이터 생성
      this.realWeather = JSON.parse(JSON.stringify(chart1))
      this.realWeather.ref = "realWeather"
      this.realWeather.option.legend.data = ['파고', '기온', '기압', '수온', '풍속']
      this.realWeather.option.series = this.detailData.realWeatherChart
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

.chart-col-height {
  height: 100vh;
  max-height: calc(100vh - (#{$appBarHeight} + (#{$paddingHeight} * 20)));
  min-height: 600px;
  // overflow-y: auto;
  overflow: hidden;
}
</style>