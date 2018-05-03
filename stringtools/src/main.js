import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.min.css'

import 'babel-polyfill'

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
	render: h => h(App)
}).$mount('#app');
