<template>
  <i-dialog-info dialog-title="시뮬레이터 변수 입력창" @hide="save(false)">
    <template v-slot:dialogBody>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step
          :complete="e1 > 1"
          step="1"
          >
            변수선택
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="e1 > 2"
            step="2"
          >
            변수입력창
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row class="ma-0">
              <v-col class="ma-2" style="background-color:#F5F5F5; height: 400px;">
                <v-col style="text-align: center;">
                  전체 변수 목록
                  <v-btn icon @click="allSelected(totalData, selectedData)"><v-icon>mdi-plus</v-icon></v-btn>
                </v-col>
                <v-col
                  v-for="(item, i) in totalData"
                  :key="i"
                  class="primary ma-3 card_bg--text"
                  style="text-align: center; width: 300px;"
                  @click="selected(item, i, totalData, selectedData)"
                >
                  {{ item }}
                </v-col>
              </v-col>

              <v-col class="ma-2" style="background-color:#F5F5F5; height: 400px;">
                <v-col style="text-align: center;">
                  선택 변수 목록
                  <v-btn icon @click="allSelected(selectedData, totalData)"><v-icon>mdi-minus</v-icon></v-btn>
                </v-col>
                <v-col
                  v-for="(item, i) in selectedData"
                  :key="i"
                  class="primary ma-3 card_bg--text"
                  style="text-align: center; width: 300px;"
                  @click="selected(item, i, selectedData, totalData)"
                >
                  {{ item }}
                </v-col>
              </v-col>
            </v-row>
            <v-col style="text-align: right;">
              <v-btn
                width="80"
                color="primary"
                @click="e1 = 2, dataSelect()"
              >
                다음
              </v-btn>
            </v-col>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-col class="ma-2" style="background-color:#F5F5F5; height: 400px;">
              <v-col>
                <v-data-table
                  :headers="headers"
                  :items="desserts"
                  fixed-header
                  hide-default-footer
                  class="elevation-1 mt-3"
                >
                  <template #body="props">
                    <tbody>
                      <tr
                        v-for="(item, i) in props.items"
                        :key="i"
                        class="orderDessert mappingTable"
                      >
                        <td>{{ item.name }}</td>
                        <td>
                          <v-text-field
                            v-model="item.value"
                            :counter="10"
                            solo
                            label="변수를 입력해주세요"
                            required
                          ></v-text-field>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </v-col>
              </v-col>
              <v-col style="text-align: right;">
                <v-btn
                  width="80"
                  color="primary"
                  @click="save"
                >
                  저장
                </v-btn>
              </v-col>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
  </i-dialog-info>
</template>

<script>
import iDialogInfo from "../common/iDialogInfo.vue"

export default {
  components: { 
    iDialogInfo,
  
  },
  data() {
    return {
      e1:1,
      tab: null,
      tabs: ['변수선택','변수입력창'],
      totalData: ['기온','수온','기압','수압'],
      selectedData: [],
      headers: [
        {text: '변수', align: 'center'},
        {text: '요소', align: 'center'}
      ],
      desserts: [],
    }
  },
  mounted() {
    
  },
  methods: {
    selected(item, i, remove, add) {
      console.log("selected",item, i)
      remove.splice(i, 1)
      add.push(item)
      item
    },
    allSelected(remove, add) {
      console.log("init")
      if(remove.length !== 0) {
        for(let i in remove) {
          add.push(remove[i])
        }
        remove.splice(0)
      }
    },
    dataSelect() {
      for(let el of this.selectedData) {
        this.desserts.push({
          name: el,
          value: ''
        })
        console.log(this.selectedData)
      }
    },
    save(boolean) {
      if(!boolean) {
        this.$emit("simulaterData", false)
      } else {
        this.$emit("simulaterData", this.desserts)
      }
      this.reset()
      console.log(this.desserts)      
    },
    reset() {
      this.e1 = 1
      this.totalData = ['기온','수온','기압','수압']
      this.selectedData = []
      this.desserts = []
    }

  }

}
</script>

<style>

</style>