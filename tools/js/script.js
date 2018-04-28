const KEY_AUTO_COPY = 'tanandre.github.io.tools.autoCopy';

function isChrome () {
	return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

function prettifyXml (sourceXml) {
	const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
	const xsltDoc = new DOMParser().parseFromString([
		'<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
		'  <xsl:output omit-xml-declaration="yes" indent="yes"/>',
		'    <xsl:template match="node()|@*">',
		'      <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
		'    </xsl:template>',
		'</xsl:stylesheet>',
	].join('\n'), 'application/xml');

	const xsltProcessor = new XSLTProcessor();
	xsltProcessor.importStylesheet(xsltDoc);
	const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
	const resultXml = new XMLSerializer().serializeToString(resultDoc);
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
		console.log(this.$refs['textareaContainer'].parentNode.clientHeight);
		const parentHeight = this.$refs['textareaContainer'].parentNode.clientHeight;
		const padding = 100;
		const height = Math.max(parentHeight - padding, 200);
		document.getElementById("textArea").setAttribute("style", "height:" + height + 'px');
		this.showTextarea = true;
	},
	methods: {
		displayError (error) {
			if (error.message) {
				return error.message;
			}
			if (error.stack) {
				return error.stack;
			}

			return 'something went wrong';
		},
		copyToClipboard () {
			const ta = document.getElementById("textArea");
			if (!ta.value) {
				return;
			}
			setTimeout(() => {
				ta.focus();
				ta.select();
				document.execCommand('copy');
				this.showCopy = true;
			})
		},

		safeExecute (fnc) {
			this.error = null;
			try {
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
})
