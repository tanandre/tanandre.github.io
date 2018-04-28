Vue.use(VueMaterial);

  function copyToClipboard() {
    setTimeout(() => {
      const ta = document.getElementById("textArea");
      ta.focus();
      ta.select();
      document.execCommand('copy');
    })
  }
  
  function prettifyXml(sourceXml) {
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
  
  Vue.material.registerTheme('default', {
    primary: 'blue',
    'default': 'blue',
    accent: 'red',
    warn: 'red',
    background: 'grey',
    theme: 'dark'
  })

  var app = new Vue({
  el: '#app',
  data: {
    textarea: '',
    error: null
  },
  methods: {
    safeExecute(fnc) {
        this.error = null;
        try {
          fnc.call(this);
          copyToClipboard();
        } catch(e) {
          console.error(e);
          this.error = e;
        }
    },

    encodeURL()  {
      this.safeExecute(() => {
        this.textarea = encodeURIComponent(this.textarea);
      });
    },

    decodeURL() {
      this.safeExecute(() => {
        this.textarea = decodeURIComponent(this.textarea);
      });
    },

    encodeBase64() {
      this.safeExecute(() => {
        this.textarea = btoa(this.textarea);
      });
    },

    decodeBase64() {
      this.safeExecute(() => {
        this.textarea = atob(this.textarea);
      });
    },
    
    formatJson() {
      this.safeExecute(() => {
        this.textarea = JSON.stringify(JSON.parse(this.textarea), null, "\t");
      });
    },
    
    formatXml() {
      this.safeExecute(() => {
        this.textarea = prettifyXml(this.textarea);
      });
    }
  }
})
