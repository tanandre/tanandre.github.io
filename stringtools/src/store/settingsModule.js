const KEY_AUTO_COPY = 'tanandre.github.io.tools.autoCopy';
const KEY_WORD_WRAP = 'tanandre.github.io.tools.wordWrap';

const settingsModule = {
	state: {
		autoCopy: localStorage.getItem(KEY_AUTO_COPY) !== 'false',
		wordWrap: localStorage.getItem(KEY_WORD_WRAP) !== 'false',
	},
	mutations: {
		autoCopy (state, autoCopy) {
			console.log('setting autocopy', autoCopy);
			// localStorage.setItem(KEY_AUTO_COPY, autoCopy);
			state.autoCopy = autoCopy
		},

		wordWrap (state, wordWrap) {
			// localStorage.setItem(KEY_WORD_WRAP, wordWrap);
			state.wordWrap = wordWrap
		}
	}
};

export default settingsModule;
