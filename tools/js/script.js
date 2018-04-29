const KEY_AUTO_COPY = 'tanandre.github.io.tools.autoCopy';

function renderButton() {
	gapi.signin2.render('my-signin2', {
		'scope': 'profile email',
		'width': 240,
		'height': 50,
		'longtitle': true,
		'theme': 'dark',
		'onsuccess': onSuccess,
		'onfailure': onFailure
	});

function onSignIn(googleUser) {
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

function prettifyXml (sourceXml) {
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
			showError: false,
			showCopy: false,
			error: null,
			drawer: true,
			showTextarea: false,
			actions: [
				{label: 'encode URL', icon: 'cloud', action: encodeURIComponent},
				{label: 'decode URL', icon: 'cloud_queue', action: decodeURIComponent},
				{label: 'encode Base64', icon: 'hdr_strong', action: btoa},
				{label: 'decode Base64', icon: 'hdr_weak', action: atob},
				{label: 'format JSON', icon: 'format_line_spacing', action: formatJson},
				{label: 'format XML', icon: 'code', action: prettifyXml}
			]
		}
	},
	mounted () {
		this.resizeTextArea();
	},
	methods: {
		resizeTextArea () {
			const parentHeight = this.$refs['textareaContainer'].parentNode.clientHeight;
			const padding = 100;
			const height = Math.max(parentHeight - padding, 200);
			document.getElementById('textArea').setAttribute('style', 'height:' + height + 'px');
			this.showTextarea = true;
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
			const ta = document.getElementById('textArea');
			setTimeout(() => {
				ta.focus();
				ta.select();
				document.execCommand('copy');

				copyDebouncer(() => {
					this.showCopy = true;
				});
			});
		},

		safeExecute (fnc) {
			this.error = null;
			try {
				if (!this.textarea) {
					return;
				}
				this.textarea = fnc(this.textarea);
				if (this.autoCopy) {
					this.copyToClipboard();
				}
			} catch (e) {
				console.error(e);
				this.error = e;
				this.showError = true;
			}
		}
	},
	watch: {
		'autoCopy' (value) {
			localStorage.setItem(KEY_AUTO_COPY, value);
		}
	}
});
