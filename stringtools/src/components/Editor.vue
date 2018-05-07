<template>
   <textarea
           @blur="onTextAreaBlur()"
           class="textarea"
           :class="{nowrap: !wordWrap}"
           v-show="showTextarea"
           autofocus
   ></textarea>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		name: 'editor',
		data() {
			return {
				showTextarea: false,
				showCopy: false,
			}
		},
		computed: {
			wordWrap() {
				return this.$store.state.settings.wordWrap;
			},
		},
		mounted() {
			this.resizeTextArea();
			setTimeout(() => {
				this.getTextArea().focus();
			}, 0);
		},
		methods: {
			getTextArea() {
				return this.$el;
			},

			resizeTextArea() {
				let ta = this.getTextArea();
				ta.setAttribute('style', 'height:' + ta.parentNode.clientHeight + 'px');
				this.showTextarea = true;
			},

			onTextAreaBlur() {
				const ta = this.getTextArea();
				setTimeout(() => {
					ta.focus();
				}, 100);
			},
		}
	}
</script>

<style scoped>
   .start textarea.linenumbers {
      padding-left: 35px;
      padding-top: 10px;
      background: url(http://i.imgur.com/2cOaJ.png);
      background-attachment: local;
      background-repeat: no-repeat;
   }

   .start textarea {
      width: 100%;
      padding: 3px;
      font-family: "Courier New";
      margin: 0;
      border: none;
   }

   textarea,
   pre {
      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;
   }

   /* turn off chrome textarea highlight */
   textarea:focus {
      outline: none;
   }

   textarea {
      overflow: auto;
   }

   textarea.nowrap {
      white-space: pre;
   }

   .edge textarea.nowrap {
      white-space: nowrap;
   }
</style>
