<template>
   <v-list dense>
      <v-subheader>Actions</v-subheader>
      <v-list-tile v-for="action in actions" @click="emitAction(action.action)">
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
   </v-list>
</template>

<script>
	export default {
		name: 'actions',
		props: ['actions'],
		methods: {
			emitAction(action) {
				this.$emit('action', action);
			},
		}
	}
</script>

<style scoped>
   .start small.shortKey {
      color: #777;
   }
</style>
