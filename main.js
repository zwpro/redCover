// 本项目为开源项目，作者微信：zheng593446899，如有问题可联系
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
