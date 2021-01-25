<script>
/* 本项目为开源项目，作者微信：zheng593446899，如有问题可联系*/
import { login, inviteTrack } from "./request"

export default {
	onLaunch: async function(e) {
		console.log(e)
		console.log('App Launch');
		var openid = uni.getStorageSync('openid');
		if (openid) {
			this.globalData.openid = openid;
			this.inviteTrack(e.query.openid, openid, e.query.id)
		} else {
			// 登录
			const [loginError, loginRes] = await uni.login();
			// 发送 res.code 到后台换取 openId, sessionKey, unionId
			const res = await login({code: loginRes.code})
			this.globalData.openid = res.result.data.user.openid;
			uni.setStorageSync('openid', res.result.data.user.openid);
			this.inviteTrack(e.query.openid, this.globalData.openid, e.query.id)		
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	globalData: {
		openid: '',
	},
	methods: {
		shareConfig(){
			var messages = [
				{
					title: '送你个性微信红包封面，发红包时可用',
					path: '/pages/index/index?openid=' + this.globalData.openid,
				},
			];
			return messages[Math.floor(Math.random()*messages.length)];
		},
		//邀请上报
		inviteTrack(inviteOpenid, openid, id){
			if(inviteOpenid && openid && inviteOpenid != openid){
				console.log(inviteOpenid, openid)
				inviteTrack({
					inviteOpenid,
					openid,
					id,
				})
			}
		},
	}
};
</script>

<style>
/*每个页面公共css */
</style>
