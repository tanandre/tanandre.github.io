import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
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
