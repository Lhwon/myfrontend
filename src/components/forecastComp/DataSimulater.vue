<template>
  <v-container>
    <v-row>
      <v-col
        cols="6"
        class="chart-col-height"
      >
        <v-col class="ma-2" style="height: 300px; border: 1px solid grey;">
          <echart
            :style="aiPower.style"
            :ref="aiPower.ref"
            :options="aiPower.option"
            class="ma-2"
          />
        </v-col>
        <v-col class="ma-2 overflow-y-auto" style="border: 1px solid grey;">
          <v-col style="height: 300px;">
            <echart
              :style="aiForecast.style"
              :ref="aiForecast.ref"
              :options="aiForecast.option"
              class="ma-2"
              height="300px"
            />
          </v-col>
          <v-row>
            <v-col cols="3">
              <v-btn @click='openSimulaterSet'>시뮬레이터 변수 입력</v-btn>
            </v-col>
            <v-col cols="3">
              시뮬레이터 매핑 결과
            </v-col>
            <v-col
              cols="6"
              v-for="(item, i) in mappingData"
              :key="i"
            >
              {{ item.name }} - {{ item.value }}
            </v-col>
          </v-row>
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
    <v-dialog
      v-model="simulaterPopup"
      width="800"
      persistent
    >
      <v-card>
        <simulaterPopup @simulaterData="simulaterData"/>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import simulaterPopup from './SimulaterPopup.vue'
import echart from '../ECharts.vue' 
// import {
//   DxPivotGrid,
//   DxFieldChooser,
// } from 'devextreme-vue/pivot-grid'

export default {
  name: 'dataSimulater',
  components:{
    simulaterPopup,
    echart,
    // DxPivotGrid,
    // DxFieldChooser
  },
  props: {
    detailData: Object
  },
  watch: {
    detailData: {
      handler(e) {
        this.mappingData = []
        if(e.mapping.length !== 0)  {
          this.mappingData = e.mapping
        }
        this.createChart()
        this.createGrid()
      },
      deep: true
    }
  },
  data() {
    return {
      simulaterPopup: false,
      mappingData : '',
      aiPower: [],
      aiForecast: [],
      dataSource: []
    }
  },
  created() {
    this.createChart()
    this.createGrid()
  },
  methods: {
    openSimulaterSet() {
      this.simulaterPopup = true
      console.log("simulaterPopup")
    },
    simulaterData(params) {
      this.simulaterPopup = false
      if(params !== false) {
        this.mappingData = params
        console.log("453456", params)
      }
      this.$emit("aiMapping", this.mappingData)
      
      console.log("123", params)
      
    },

    createChart() {
      let chart = {
        style: 'height:90%; width:90%; marginLeft: auto !important; marginRight: auto !important;',
        ref: '',
        option: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['발전량', '송전량']
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
      this.aiPower = JSON.parse(JSON.stringify(chart))
      this.aiPower.ref = "aiPower"
      this.aiPower.option.series = this.detailData.aiPowerChart

      // 실시간 송전량 Weatehr차트 데이터 생성
      this.aiForecast = JSON.parse(JSON.stringify(chart))
      this.aiForecast.ref = "aiForecast"
      this.aiForecast.option.series = this.detailData.aiForecastChart
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