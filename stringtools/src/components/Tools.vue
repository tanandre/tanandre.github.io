<template>
   <v-app dark>
      <v-navigation-drawer clipped fixed v-model="drawer" app>
         <v-list dense>
            <v-subheader>Actions</v-subheader>
            <v-list-tile v-for="action in actions" @click="safeExecute(action.action)">
               <v-list-tile-action>
                  <v-icon>{{action.icon}}</v-icon>
               </v-list-tile-action>
               <v-list-tile-content>
                  <v-list-tile-title>{{action.label}}</v-list-tile-title>
               </v-list-tile-content>
               <v-list-tile-action>
                  <v-list-tile-sub-title>
                     <small class="shortKey">{{action.shortKey}}</small>
                  </v-list-tile-sub-title>
               </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-subheader>Settings</v-subheader>
            <v-list-tile @click="">
               <v-list-tile-action>
                  <v-switch v-model="autoCopy"></v-switch>
               </v-list-tile-action>
               <v-list-tile-content @click="autoCopy = !autoCopy">
                  <v-list-tile-title>Auto copy</v-list-tile-title>
               </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="">
               <v-list-tile-action>
                  <v-switch v-model="wordWrap"></v-switch>
               </v-list-tile-action>
               <v-list-tile-content @click="wordWrap = !wordWrap">
                  <v-list-tile-title>Word wrap</v-list-tile-title>
               </v-list-tile-content>
            </v-list-tile>
         </v-list>

      </v-navigation-drawer>
      <v-toolbar app fixed clipped-left dense class="toolbar">
         <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
         <v-toolbar-title>String Tools</v-toolbar-title>
         <v-spacer></v-spacer>
         <!--<div class="g-signin2" data-onsuccess="onSignIn"></div>-->

         <v-toolbar-items>
            <v-btn @click="signOut()" flat small>Sign out
               <v-icon right dark>account_circle</v-icon>
            </v-btn>
         </v-toolbar-items>
      </v-toolbar>
      <v-content>
         <textarea
                 @blur="onTextAreaBlur()"
                 ref="textareaContainer"
                 v-show="showTextarea"
                 class="textarea"
                 :class="{nowrap: !wordWrap}"
                 autofocus
         ></textarea>
         <ErrorToaster></ErrorToaster>
         <v-snackbar v-model="showCopy" top>
            <span><v-icon class="snackbarIcon">content_copy</v-icon><small>Text copied...</small></span>
         </v-snackbar>
      </v-content>
   </v-app>
</template>

<script>
	const KEY_AUTO_COPY = 'tanandre.github.io.tools.autoCopy';
	const KEY_WORD_WRAP = 'tanandre.github.io.tools.wordWrap';

	function signOut() {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			console.log('User signed out.');
		});
	}

	function onSignIn(googleUser) {
		var profile = googleUser.getBasicProfile();
		console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		console.log('Name: ' + profile.getName());
		console.log('Image URL: ' + profile.getImageUrl());
		console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	}

	function debounce(ms) {
		let timer = 0;
		return (callback) => {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		}
	}

	function formatXml(input) {
		const indent = '\t'; //you can set/define other ident than tabs
		// let xmlString = input.replace(/^\s+|\s+$/g, '');  //trim it (just in case) {method trim() not working in IE8}

		const xmlString = input.trim()
			.replace(/(<([a-zA-Z]+\b)[^>]*>)(?!<\/\2>|[\w\s])/g, "$1\n") //add \n after tag if not followed by the closing tag of pair or text node
			.replace(/(<\/[a-zA-Z]+[^>]*>)/g, "$1\n") //add \n after closing tag
			.replace(/>\s+(.+?)\s+<(?!\/)/g, ">\n$1\n<") //add \n between sets of angled brackets and text node between them
			.replace(/>(.+?)<([a-zA-Z])/g, ">\n$1\n<$2") //add \n between angled brackets and text node between them
			.replace(/\?></, "?>\n<") //detect a header of XML

		const xmlArr = xmlString.split('\n');  //split it into an array (for analise each line separately)

		//PART 2: indent each line appropriately

		let tabs = '';  //store the current indentation
		let start = 0;  //starting line

		if (/^<[?]xml/.test(xmlArr[0])) start++;  //if the first line is a header, ignore it

		for (let i = start; i < xmlArr.length; i++) {
			let line = xmlArr[i].replace(/^\s+|\s+$/g, '');  //trim it (just in case)

			if (/^<[/]/.test(line)) {
				tabs = tabs.replace(indent, '');  //remove one indent from the store
				xmlArr[i] = tabs + line;  //add the tabs at the beginning of the line
			} else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(line)) {
				//leave the store as is
				xmlArr[i] = tabs + line; //add the tabs at the beginning of the line
			} else if (/<.*>/.test(line)) {
				xmlArr[i] = tabs + line;  //add the tabs at the beginning of the line
				tabs += indent;  //and add one indent to the store
			} else {
				xmlArr[i] = tabs + line;  // add the tabs at the beginning of the line
			}
		}

		//PART 3: return formatted string (source)
		return xmlArr.join('\n');  //rejoin the array to a string and return it
	}

	function formatJson(value) {
		return JSON.stringify(JSON.parse(value), null, "\t");
	}

	function isEdge() {
		return /Edge\/\d./i.test(navigator.userAgent);
	}

	let copyDebouncer = debounce(400);


	import ErrorToaster from './ErrorToaster.vue'

	export default {
		components: {ErrorToaster},
		name: 'tools',
		data() {
			return {
				textarea: '',
				autoCopy: localStorage.getItem(KEY_AUTO_COPY) !== 'false',
				wordWrap: localStorage.getItem(KEY_WORD_WRAP) !== 'false',
				showCopy: false,
				drawer: true,
				showTextarea: true,
				isEdge: isEdge(),
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
		mounted() {
			console.log(this.$store);
			window.addEventListener('keydown', this.onKeyDown)
			this.resizeTextArea();
			setTimeout(() => {
				this.getTextArea().focus();
			}, 0);
		},
		methods: {
			onKeyDown(key) {
				const ta = this.getTextArea();
				if (!ta.value) {
					return;
				}

				// console.log(key, key.keyCode);
				if (key.ctrlKey && key.shiftKey && key.keyCode === 70) {
					let errors = [];
					try {
						ta.value = formatJson(ta.value);
					} catch (e) {
						errors.push(e);
					}
					try {
						ta.value = formatXml(ta.value);
					} catch (e) {
						errors.push(e);
					}

					if (errors.length === 2) {
						this.handleError(new Error('text not formatted: could not parse as JSON or XML'));
					}
					this.copyToClipboard();
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

			signOut() {
				signOut();
			},

			getTextArea() {
				return this.$refs['textareaContainer'].$el ? this.$refs['textareaContainer'].$el : this.$refs['textareaContainer'];
			},

			resizeTextArea() {
				let ta = this.getTextArea();
				ta.setAttribute('style', 'height:' + ta.parentNode.clientHeight + 'px');
				this.showTextarea = true;
			},

			displayError(error) {
				if (error.message) {
					return error.message;
				} else if (error.stack) {
					return error.stack;
				}

				return 'something went wrong';
			},

			onTextAreaBlur() {
				const ta = this.getTextArea();
				setTimeout(() => {
					ta.focus();
				}, 100);
			},

			copyToClipboard() {
				const ta = this.getTextArea();
				// attempt to add to undo buffer
				ta.blur();
				ta.focus();

				ta.select();
				document.execCommand('copy');
				copyDebouncer(() => {
					ta.blur();
					ta.focus();
					this.showCopy = true;
				});
			},

			handleError(e) {
				console.error(e);
				this.$store.commit('error', e);
			},

			safeExecute(fnc) {
				this.error = null;
				try {
					const ta = this.getTextArea();
					if (!ta.value) {
						return;
					}

					// attempt to add to undo buffer
					ta.blur();
					ta.focus();

					let value = fnc(ta.value);
					//this.textarea = value;
					ta.value = value;
					if (this.autoCopy) {
						this.copyToClipboard();
					}
				} catch (e) {
					this.handleError(e);
				}
			}
		},
		watch: {
			'autoCopy'(value) {
				localStorage.setItem(KEY_AUTO_COPY, value);
				this.$store.commit('autoCopy', value);
			},
			'wordWrap'(value) {
				this.$store.commit('wordWrap', value);
				localStorage.setItem(KEY_WORD_WRAP, value);
			}
		}
	}
</script>

<style scoped>
   html {
      background-color: rgb(48, 48, 48);
      overflow-y: hidden;
   }

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

   .errorMessage {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   .start .snackbarIcon.icon {
      margin-right: 5px;
   }

   .start .navigation-drawer {
      padding: 0px;
   }

   .start small.shortKey {
      color: #777;
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

   /*.toolbar .abcRioButtonLightBlue {*/
   /*background-color: rgb(48, 48, 48);*/
   /*}*/
</style>
