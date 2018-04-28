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
};


let app = new Vue({
	el: '#app',
	data () {
		return {
			textarea: '',
			showError: false,
			showCopy: false,
			error: null,
			drawer: true,
			actions: [
				{label: 'encode URL', icon: 'cloud', action: this.encodeURL},
				{label: 'decode URL', icon: 'cloud_queue', action: this.decodeURL},
				{label: 'encode Base64', icon: 'hdr_strong', action: this.encodeBase64},
				{label: 'decode Base64', icon: 'hdr_weak', action: this.decodeBase64},
				{label: 'format JSON', icon: 'code', action: this.formatJson},
				{label: 'format XML', icon: 'code', action: this.formatXml}
			]
		}
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
				fnc.call(this);
				this.copyToClipboard();
			} catch (e) {
				console.error(e);
				this.error = e;
				this.showError = true;
			}
		},

		encodeURL () {
			this.safeExecute(() => {
				this.textarea = encodeURIComponent(this.textarea);
			});
		},

		decodeURL () {
			this.safeExecute(() => {
				this.textarea = decodeURIComponent(this.textarea);
			});
		},

		encodeBase64 () {
			this.safeExecute(() => {
				this.textarea = btoa(this.textarea);
			});
		},

		decodeBase64 () {
			this.safeExecute(() => {
				this.textarea = atob(this.textarea);
			});
		},

		formatJson () {
			this.safeExecute(() => {
				this.textarea = JSON.stringify(JSON.parse(this.textarea), null, "\t");
			});
		},

		formatXml () {
			this.safeExecute(() => {
				this.textarea = prettifyXml(this.textarea);
			});
		}
	}
})
