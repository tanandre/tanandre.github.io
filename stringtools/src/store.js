import Vue from 'vue'
import Vuex from 'vuex'

import settingsModule from './store/settingsModule'

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		settings: settingsModule
	},
	state: {
		error: null
	},
	mutations: {
		error (state, error) {
			state.error = error;
		}
	},
	actions: {}
});

export default store
