const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
    'vuetify'
  ],
  
})
