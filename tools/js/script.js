const KEY_AUTO_COPY = 'tanandre.github.io.tools.autoCopy';
const KEY_WORD_WRAP = 'tanandre.github.io.tools.wordWrap';

function signOut () {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}

function onSignIn (googleUser) {
	var profile = googleUser.getBasicProfile();
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function debounce (ms) {
	let timer = 0;
	return (callback) => {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	}
}

function isChrome () {
	return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

function formatXml (sourceXml) {
	const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
	const xsltDoc = new DOMParser().parseFromString([
		'<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
		'<xsl:output omit-xml-declaration="yes" indent="yes"/>',
		'<xsl:template match="node()|@*">',
		'<xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
		'</xsl:template>',
		'</xsl:stylesheet>',
	].join(''), 'application/xml');

	const xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet(xsltDoc);
	const resultXml = new XMLSerializer().serializeToString(xsltProcessor.transformToDocument(xmlDoc));
	if (isChrome()) {
		if (resultXml.includes('parsererror') && resultXml.includes('This page contains the following errors')) {
			throw new Error('cannot parse XML');
		}
	}
	return resultXml;
}

function formatJson (value) {
	return JSON.stringify(JSON.parse(value), null, "\t");
}

let copyDebouncer = debounce(400);

let app = new Vue({
	el: '#app',
	data () {
		return {
			textarea: '',
			autoCopy: localStorage.getItem(KEY_AUTO_COPY) !== 'false',
			wrap: localStorage.getItem(KEY_WORD_WRAP) !== 'false',
			showError: false,
			showCopy: false,
			error: null,
			drawer: true,
			showTextarea: true,
			actions: [
				{label: 'encode URL', icon: 'cloud', shortKey: 'ctrl-[', action: encodeURIComponent},
				{label: 'decode URL', icon: 'cloud_queue', shortKey: 'ctrl-shift-[', action: decodeURIComponent},
				{label: 'encode Base64', icon: 'hdr_strong', shortKey: 'ctrl-]', action: btoa},
				{label: 'decode Base64', icon: 'hdr_weak', shortKey: 'ctrl-shift-]', action: atob},
				{label: 'format JSON', icon: 'format_line_spacing', shortKey: 'ctrl-shift-f', action: formatJson},
				{label: 'format XML', icon: 'code', shortKey: 'ctrl-shift-f', action: formatXml}
			]
		}
	},
	mounted () {
		window.addEventListener('keydown', this.onKeyDown)
		this.resizeTextArea();
	},
	methods: {
		onKeyDown (key) {
			if (!this.textarea) {
				return;
			}

			// console.log(key, key.keyCode);
			if (key.ctrlKey && key.shiftKey && key.keyCode === 70) {
				let errors = [];
				try {
					this.textarea = formatJson(this.textarea);
				} catch (e) {
					errors.push(e);
				}
				try {
					this.textarea = formatXml(this.textarea.trim());
				} catch (e) {
					errors.push(e);
				}

				if (errors.length === 2) {
					this.handleError(new Error('text not formatted: could not parse as JSON or XML'));
				}
				return;
			}

			if (key.ctrlKey && !key.shiftKey && key.keyCode === 219) {
				return this.safeExecute(encodeURIComponent);
			} else if (key.ctrlKey && key.shiftKey && key.keyCode === 219) {
				return this.safeExecute(decodeURIComponent);
			} else if (key.ctrlKey && !key.shiftKey && key.keyCode === 221) {
				return this.safeExecute(btoa);
			} else if (key.ctrlKey && key.shiftKey && key.keyCode === 221) {
				return this.safeExecute(atob);
			}
		},

		signOut () {
			signOut();
		},

		getTextArea () {
			return this.$refs['textareaContainer'].$el ? this.$refs['textareaContainer'].$el : this.$refs['textareaContainer'];
		},

		resizeTextArea () {
			let ta = this.getTextArea();
			ta.setAttribute('style', 'height:' + ta.parentNode.clientHeight + 'px');
			this.showTextarea = true;
			ta.focus();
		},

		displayError (error) {
			if (error.message) {
				return error.message;
			} else if (error.stack) {
				return error.stack;
			}

			return 'something went wrong';
		},
		copyToClipboard () {
			const ta = this.getTextArea();
			setTimeout(() => {
				ta.focus();
				ta.select();
				document.execCommand('copy');

				copyDebouncer(() => {
					this.showCopy = true;
				});
			});
		},

		handleError (e) {
			console.error(e);
			this.error = e;
			this.showError = true;
		},

		safeExecute (fnc) {
			this.error = null;
			try {
				if (!this.textarea) {
					return;
				}
				this.textarea = fnc(this.textarea);
				const ta = this.getTextArea();
				ta.blur();
				ta.focus();
				if (this.autoCopy) {
					this.copyToClipboard();
				}
			} catch (e) {
				this.handleError(e);
			}
		}
	},
	watch: {
		'autoCopy' (value) {
			localStorage.setItem(KEY_AUTO_COPY, value);
		},
		'wordWrap' (value) {
			localStorage.setItem(KEY_WORD_WRAP, value);
		}
	}
});
