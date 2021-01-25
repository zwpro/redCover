<template>
	<view class="wrapper">
		<view class="recommand" v-if="couponList.length > 0">
			<view class="recommand-content">
				<view :class="['recommand-content-item', coupon.platform]" v-for="(coupon, i) in couponList" :key="i" @click="toCoupon(i)" >
					<image :src="coupon.border" mode="" class="recommand-content-item-border" v-if="coupon.border"></image>
					<image :src="coupon.icon" mode="" class="recommand-content-item-img"></image>
					<view class="recommand-content-item-name">
						{{coupon.name}}
					</view>
					<view class="recommand-content-item-desc">
						{{coupon.desc}}
					</view>
					<view class="recommand-content-item-tip">
						{{coupon.tip}}
					</view>
				</view>
			</view>
			
		</view>
		<wyb-noticeBar :text="tips" type="vert" :show-more="false" class="notice" v-if="tips.length > 0"/>
		<view class="list">
			<view class="list-item" v-for="(cover, i) in coverList" @click="goDetail(cover._id)" :key="i">
				<image :src="cover.pic" mode="" class="list-item-img"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { cover } from '../../request'
	export default {
		data() {
			return {
				couponList: [],
				coverList: [],
				tips: [],
			}
		},
		onLoad() {
			this.getCoverList()
		},
		onShareAppMessage(res) {
			return getApp().shareConfig()
		},
		methods: {
			goDetail(id){
				uni.navigateTo({
				    url: `/pages/detail/detail?id=${id}`
				});
			},
			async getCoverList(){
				uni.showLoading({
					title: "获取封面中"
				})
				const res = await cover()
				this.couponList = res.result.data.couponList
				this.coverList = res.result.data.coverList
				this.tips = res.result.data.tips
				uni.hideLoading()
			},
			toCoupon(i){
				console.log(this.couponList[i])
				if(this.couponList[i].minapp){
					wx.navigateToMiniProgram({
					  appId: this.couponList[i].minapp.appid,
					  path: this.couponList[i].minapp.path,
					  success(res) {
						// 打开成功
					  }
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.wrapper {
		.recommand{
			display: flex;
			padding: 30rpx 30rpx 46rpx;
			position: relative;
			&::after{
				content: "";
				position: absolute;
				width: 100%;
				height: 16rpx;
				bottom: 0;
				left: 0;
				background: #f8f8f8;
			}
			&-content{
				display: flex;
				overflow-y: scroll;
				&::-webkit-scrollbar {
					display: none;
					width: 0 !important;
					height: 0 !important;
					-webkit-appearance: none;
					background: transparent;
				}
				&-item{
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					flex-shrink: 0;
					width: 200rpx;
					padding: 20rpx 0;
					margin-right: 20rpx;
					border-radius: 8px;
					position: relative;
					&.ele{
						background-color: #e2f2ff;
					}
					&.meituan{
						background-color: #fff2d2;
					}
					&-border{
						position: absolute;
						top: 0;
						right: 0;
						width: 60rpx;
						height: 60rpx;
					}
					&-img{
						width: 100rpx;
						height: 100rpx;
						border-radius: 100%;
					}
					&-name{
						width: 100%;
						margin-top: 10rpx;
						text-align: center;
						font-size: 28rpx;
						color: #333333;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					&-desc{
						margin: 10rpx 0;
						color: #e52b2b;
						font-weight: 700;
					}
					&-tip{
						font-size: 26rpx;
						color: #8e8e8e;
					}
				}
			}
			
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 25rpx 15rpx;
			&-item{
				width: 240rpx;
				box-sizing: border-box;
				box-shadow:0px 15px 10px -15px #000;
				margin-bottom: 20rpx;
				&-img{
					display: block;
					margin: auto;
					width: 220rpx;
					height: 360rpx;
					border-radius: 8px 8px 0 0;
				}
			}
		}
		
		
	}
</style>
