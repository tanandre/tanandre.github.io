const KEY_AUTO_COPY = 'tanandre.github.io.tools.autoCopy';
const KEY_WORD_WRAP = 'tanandre.github.io.tools.wordWrap';

const settingsModule = {
	state: {
		autoCopy: localStorage.getItem(KEY_AUTO_COPY) !== 'false',
		wordWrap: localStorage.getItem(KEY_WORD_WRAP) !== 'false',
	},
	mutations: {
		autoCopy(state, value) {
			localStorage.setItem(KEY_AUTO_COPY, value);
			state.autoCopy = value
		},

		wordWrap(state, value) {
			localStorage.setItem(KEY_WORD_WRAP, value);
			state.wordWrap = value
		}
	}
};

export default settingsModule;
