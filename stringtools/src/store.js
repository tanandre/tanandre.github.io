import Vue from 'vue'
import Vuex from 'vuex'

import settingsModule from './store/settingsModule'
import sessionModule from './store/sessionModule'

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		settings: settingsModule,
		session: sessionModule
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
