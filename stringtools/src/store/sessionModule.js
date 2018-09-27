
const sessionModule = {
	state: {
		user: null,
	},
	mutations: {
		user(state, value) {
			state.user = value
		}
	}
};

export default sessionModule;
