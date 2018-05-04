<template>
   <v-snackbar v-model="error" v-if="error" color="error">
      <span :title="displayError(error)" class="errorMessage">
         <v-icon class="snackbarIcon">error</v-icon><b>Error:</b> {{displayError(error)}}
      </span>
   </v-snackbar>
</template>

<script>
	export default {
		name: 'errorToaster',
		props: [],
		computed: {
			error: {
				get () {
					return this.$store.state.error
				},
				set (error) {
					this.$store.commit('error', error)
				}
			}
		},
		methods: {
			displayError (error) {
				if (error.message) {
					return error.message;
				} else if (error.stack) {
					return error.stack;
				}
				return 'something went wrong';
			}
		}
	}
</script>

<style scoped>
   .errorMessage {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   .start .snackbarIcon.icon {
      margin-right: 5px;
   }
</style>
