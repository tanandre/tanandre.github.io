<template>
   <v-list dense>
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
</template>

<script>
	export default {
		name: 'settings',
		computed: {
			wordWrap: {
				get () {
					return this.$store.state.settings.wordWrap;
				},
				set (value) {
					this.$store.commit('wordWrap', value)
				}
			},
			autoCopy: {
				get () {
					return this.$store.state.settings.autoCopy
				},
				set (value) {
					this.$store.commit('autoCopy', value)
				}
			},
		},
	}
</script>

<style scoped>
</style>
