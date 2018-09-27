<template>
   <div>
      <div v-show="user == null" class="g-signin2" data-onsuccess="onSignIn"></div>
      <v-btn v-if="user" @click="signOut()" flat>
         <span>Sign out {{user.getName()}}</span>
         <img class="avatar" :src="user.getImageUrl()"/>
      </v-btn>
   </div>
</template>

<script>
	import { mapState } from 'vuex';
	import store from '../store';

	window.onSignIn = function (googleUser) {
		const profile = googleUser.getBasicProfile();
		store.commit('user', profile);
	};

	export default {
		computed: {
			...mapState({
				user: state => state.session.user
			}),
		},
		methods: {
			signOut() {
				store.commit('user', null);
				const auth2 = gapi.auth2.getAuthInstance();
				auth2.signOut().then(() => {
					console.log('User signed out.');
				});
			},
		}
	}
</script>

<style>
   .avatar {
      border-radius: 50%;
      height: 32px;
      margin: 8px 0 8px 24px;
      outline: 0;
      vertical-align: top;
      width: 32px;
   }


   .g-signin2 .abcRioButtonContentWrapper,
   .g-signin2 .abcRioButton {
      background-color: #222!important;
      color: #eee;
   }
</style>
