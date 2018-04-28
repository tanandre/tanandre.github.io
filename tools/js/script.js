function copyToClipboard () {
	setTimeout(() => {
		const ta = document.getElementById("textArea");
		ta.focus();
		ta.select();
		document.execCommand('copy');
	})
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
	return new XMLSerializer().serializeToString(resultDoc);
};


// function encodeURL1 () {
// 	alert('test');
// }

var app = new Vue({
	el: '#app',
	data () {
		return {
			textarea: '',
			error: null,
			actions: [
				{label: 'encode URL', icon:'skip_next', action: this.encodeURL},
				{label: 'decode URL', icon:'skip_previous', action: this.decodeURL},
				{label: 'encode Base64', icon:'skip_next', action: this.encodeBase64},
				{label: 'decode Base64', icon:'skip_previous', action: this.decodeBase64},
				{label: 'format JSON', icon:'code', action: this.formatJson},
				{label: 'format XML', icon:'code', action: this.formatXml}
			]
		}
	},
	methods: {
		safeExecute (fnc) {
			this.error = null;
			try {
				fnc.call(this);
				copyToClipboard();
			} catch (e) {
				console.error(e);
				this.error = e;
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
