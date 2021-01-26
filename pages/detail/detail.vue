<template>
	<view class="wrapper">
		<view class="cover">
			<image :src="coverDetail.pic" mode="" class="cover-img"></image>
		</view>
		<ad :unit-id="ad.two" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white" v-if="ad.two"></ad>
		<view class="func">
			<button plain class="func-btn" open-type="share" v-if="coverDetail.inviteLockNum > 0">
				<image src="/static/share.png" mode="" class="func-btn-img"></image>
				邀请好友领取（{{lockEdInfo.inviteLockNum}}/{{coverDetail.inviteLockNum}}）
			</button>
			<button plain class="func-btn" @click="lookAd" v-if="coverDetail.lookVideoLockNum > 0">
				<image src="/static/video.png" mode="" class="func-btn-img"></image>
				观看视频领取（{{lockEdInfo.lookVideoLockNum}}/{{coverDetail.lookVideoLockNum}}）
			</button>
			<button plain class="func-btn success" @click="openModal" v-if="lockEdInfo.isLocked">
				领取封面
			</button>
		</view>
		<view class="recommand">更多封面👇👇👇</view>
		<ad-custom :unit-id="ad.three" v-if="ad.three"></ad-custom>
		<ad :unit-id="ad.four" ad-type="video" ad-theme="white" v-if="ad.four"></ad>
		<view class="modal" @touchmove.stop="handle" @click="closeModal" v-if="modalShow">
			<view class="modal-content" @click.stop="openModal">
				<view class="modal-content-body" @click="handleCopy">
					<view class="modal-content-body-title">
						领取方式(点击复制内容)
					</view>
					<text user-select decode class="modal-content-body-getdesc">{{coverDetail.getDesc}}</text>
					<button plain class="modal-content-body-question" open-type="contact">有疑问？</button>
				</view>
				<image src="/static/close.png" mode="" class="modal-content-cancel" @click.stop="closeModal"></image>
			</view>
		</view>
	</view>
</template>

<script>
import { coverDetail, lookVideo } from '../../request';

var rewardedVideoAd = null
// 在页面中定义插屏广告
var interstitialAd = null
export default {
	data() {
		return {
			id: '',
			modalShow: '',
			coverDetail: {
				inviteLockNum: 0,
				lookVideoLockNum: 0,
				getDesc: "",
			},
			lockEdInfo: {
				inviteLockNum: 0,
				lookVideoLockNum: 0,
				isLocked: false,
			},
			ad: '',
		};
	},
	onLoad(e) {
		this.id = e.id
		this.getCoverDetail(true)
	},
	onShow(e) {
		this.getCoverDetail(false)
	},
	onShareAppMessage(res) {
		var shareConfig = getApp().shareConfig()
		shareConfig.path += '&id='+this.id
		console.log(shareConfig)
		return shareConfig
	},
	methods: {
		handle(){
			return
		},
		async getCoverDetail(isFirst){
			const res = await coverDetail({
				id: this.id,
				openid: getApp().globalData.openid,
			})
			this.coverDetail = res.result.data.coverDetail
			this.lockEdInfo = res.result.data.lockEdInfo
			this.ad = res.result.data.ad
			if(isFirst && this.ad){
				//激励视频和插屏广告
				if(this.ad.one){
					this.adinsertInit(this.ad.one)
				}
				if(this.ad.five){
					this.adInit(this.ad.five);
				}
			}
			if(this.lockEdInfo.isLocked){
				this.modalShow = true
			}
			uni.hideLoading()
		},
		lookAd() {
			rewardedVideoAd.show().catch(() => {
				rewardedVideoAd
					.load()
					.then(() => rewardedVideoAd.show())
					.catch(err => {
						uni.showToast({
							title: '调起视频失败，请稍后再试',
							icon: 'none',
							duration: 2000
						});
						console.log('激励视频 广告显示失败');
					});
			});
		},
		//初始化视频广告
		adInit(adUnitId) {
			if (wx.createRewardedVideoAd) {
				rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: adUnitId });
				rewardedVideoAd.onLoad(() => {
					console.log('Ad onLoad event emit');
				});
				rewardedVideoAd.onError(err => {
					console.log('Ad onError event emit', err);
				});
				rewardedVideoAd.onClose(res => {
					console.log('Ad onClose event emit', res);
					if (res && res.isEnded) {
						this.lockEdInfo.lookVideoLockNum++
						console.log('正常播放结束，可以下发游戏奖励');
					} else {
						console.log('播放中途退出，不下发游戏奖励');
					}
					this.trackLookVideo(res.isEnded)
				});
			}
		},
		//初始化插屏广告
		adinsertInit(adUnitId) {
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: adUnitId
				})
				interstitialAd.onLoad(() => {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				})
				interstitialAd.onError((err) => {})
				interstitialAd.onClose(() => {})
			}
		},
		//看视频上班
		async trackLookVideo(isEnded){
			await lookVideo({
				openid: getApp().globalData.openid,
				id: this.id,
				isEnded,
			})
		},
		openModal(){
			this.modalShow = true
		},
		closeModal(){
			this.modalShow = false
    },
    handleCopy() {
      let data = this.coverDetail.getDesc;
      wx.setClipboardData({
        data: data,
        success(res) {},
      });
    },
	}
};
</script>

<style lang="scss">
.wrapper {
	.cover {
		background-image: url(https://res.wx.qq.com/a/wx_fed/money-envelope-cover/res/img/skin_bg.59803d00.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding: 40rpx 0;
		margin: 10rpx 60rpx;
		&-img {
			width: 300rpx;
			height: 500rpx;
			margin: auto;
			border-radius: 8px;
			display: block;
		}
	}
	.func {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 600rpx;
		margin: auto;
		margin-bottom: 30rpx;
		&-btn {
			border: none;
			padding: 0 40rpx;
			height: 90rpx;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background-color: #fbd926;
			border-radius: 90rpx;
			margin-top: 30rpx;
			font-size: 34rpx;
			font-weight: 700;
			&.success{
				background-color: #07c160;
				color: #FFFFFF;
			}
			&-img {
				width: 34rpx;
				height: 34rpx;
				display: block;
				margin-right: 6rpx;
			}
		}
		&-or{
			width: 100%;
			text-align: center;
			margin-top: 30rpx;
			font-size: 26rpx;
		}
	}
	.recommand {
		margin-left: 20rpx;
	}
	.modal{
		width: 100%;
		height: 100%;
		background-color: rgba(000, 000, 000, 0.7);
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		&-content{
			&-body{
				width: 600rpx;
				padding: 60rpx 0;
				background-color: #FFFFFF;
				border-radius: 8px;
				&-title{
					font-size: 34rpx;
					color: #333333;
					font-weight: 700;
					text-align: center;
					margin-bottom: 30rpx;
				}
				&-getdesc{
					text-align: center;
					margin: auto;
					display: block;
				}
				&-question{
					margin: auto;
					display: block;
					border: none;
					font-size: 28rpx;
					color: #576b95;
					margin-top: 30rpx;
				}
			}
			&-cancel{
				width: 50rpx;
				height: 50rpx;
				margin: auto;
				display: block;
				margin-top: 60rpx;
			}
		}
		
	}
}
</style>
