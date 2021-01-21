<template>
	<view class="container" v-if="show" 
	 :style="{
		 width: rpxWidth + 'rpx',
		 height: height + 'rpx',
		 backgroundColor: bgColor || autoBgColor,
		 border: hasBorder ? '1px solid' + color : 'none'}">
	
		<view class="close-box" v-if="showClose" @tap="show = false" 
		 :style="{
			width: autoCloseWidth + 'px',
			height: height + 'rpx',
			paddingLeft: showIcon ? '10rpx' : '0',
			backgroundColor: bgColor || autoBgColor}">
			<view class="iconfont icon-close" :style="{
				 fontSize: autoCloseSize,
				 color: color,
				 lineHeight: height + 'rpx'}" />
		</view>
	
		<view class="notice-box" v-if="showIcon" 
		 :style="{
			 width: autoNoticeWidth + 'px',
			 height: height + 'rpx',
			 backgroundColor: bgColor || autoBgColor}">
			<view class="iconfont icon-tongzhi" 
			 :style="{
				 fontSize: autoNoticeSize,
				 color: color,
				 lineHeight: height + 'rpx'}" />
		</view>
	
		<view class="marquee-hori" v-if="type==='hori-connect'" @tap="showMoreExtendTap"
		 :style="{
			 width: autoMarQueeWidth + 'px',
			 height: '105%',
			 backgroundColor: bgColor || autoBgColor}">
			 
			<view class="box-hori" 
			 :style="{
				 width: autoBoxWidth + 'px',
				 animationName: scroll ? '' : 'none',
				 animationDuration: animDur}">
				<text id="text" 
				 :style="{
					 whiteSpace: 'pre',
					 color: color,
					 fontWeight: fontWeight,
					 fontSize: fontSize + 'rpx',
					 lineHeight: height + 'rpx'}">{{text.length<=1 ? text[0] : text.join(join)}}</text>
				<view :style="'width: ' + blockWidth + 'px; height: 100%'" />
				<text 
				 :style="{
					 whiteSpace: 'pre',
					 color: color,
					 fontWeight: fontWeight,
					 fontSize: fontSize + 'rpx',
					 lineHeight: height + 'rpx'}">{{text.length<=1 ? text[0] : text.join(join)}}</text>
				<view :style="'width: ' + blockWidth + 'px; height: 100%'" />
			</view>
		</view>
		
		<view class="marquee-vert" v-if="type==='vert' || type === 'hori-break'" @tap="showMoreExtendTap"
		 :style="{
			 width: autoMarQueeWidth + 'px',
			 height: '100%',
			 backgroundColor: bgColor || autoBgColor}">
			<view class="box-vert">
				<swiper
				 class="swiper"
				 :style="{height: fontSize  * 1.3 + 'rpx'}" 
				 :autoplay="scroll" 
				 :interval="time" 
				 :duration="duration"
				 :vertical="type === 'vert'" 
				 :circular="true" 
				 :touchable="false"
				 :disable-touch="true"
				 @animationfinish="swpChange">
					<swiper-item 
					 class="swiper-item" 
					 v-for="(item,index) in text" :key="index" 
					 v-if="text.length <= 2">
						<text :style="{
								  whiteSpace: 'pre',
								  color: color,
								  fontWeight: fontWeight,
								  fontSize: fontSize + 'rpx'}">{{item}}</text>
					</swiper-item>
					
					<swiper-item v-if="text.length > 2" class="swiper-item">
						<text :style="{
								  whiteSpace: 'pre',
								  color: color,
								  fontWeight: fontWeight,
								  fontSize: fontSize + 'rpx'}">{{swp[0]}}</text>
					</swiper-item>
					<swiper-item v-if="text.length > 2" class="swiper-item">
						<text :style="{
								  whiteSpace: 'pre',
								  color: color,
								  fontWeight: fontWeight,
								  fontSize: fontSize + 'rpx'}">{{swp[1]}}</text>
					</swiper-item>
					
				</swiper>
			</view>
		</view>
	
		<view class="look-more-box" v-if="showMore" @tap="showMoreTap" :style="{
			 width: autoMoreWidth + 'px',
			 height: height + 'rpx',
			 backgroundColor: bgColor || autoBgColor}">
			<view class="iconfont icon-right" :style="{
				 fontSize: autoMoreSize,
				 color: color,
				 lineHeight: height + 'rpx'}" />
		</view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				animDur: '5s',
				autoBoxWidth: 0,
				autoBoxHeight: 0,
				textPercent: 0.77,
				noticePercent: 0.09,
				morePercent: 0.09,
				closePercent: 0.065,
				swp: this.text.slice(),
				textIdx: 0,
			}
		},
		computed: {
			rpxWidth() {
				return parseFloat(this.width) / uni.getSystemInfoSync().screenWidth * 750
			},
			autoMarQueeWidth() {
				let percent = this.textPercent

				if (!this.showClose) {
					percent += this.closePercent
				}
				if (!this.showIcon) {
					percent += this.noticePercent
				}
				if (!this.showMore) {
					percent += this.morePercent
				}

				return parseFloat(this.width) * percent
			},
			autoNoticeWidth() {
				return parseFloat(this.width) * this.noticePercent
			},
			autoMoreWidth() {
				return parseFloat(this.width) * this.morePercent
			},
			autoCloseWidth() {
				return parseFloat(this.width) * this.closePercent
			},
			blockWidth() {
				let result = 0
				let eleWidth = 0
				this.getRect('#text').then(res => {
					eleWidth = res.width
				})
				let comWidth = parseFloat(this.autoMarQueeWidth)
				result = comWidth - parseFloat(eleWidth) - (this.spaceConst)
				return result
			},
			autoBgColor() {
				return this.RGBChange(this.color, 0.85, 'light')
			},
			autoNoticeSize() {
				return parseFloat(this.width) * 0.087 + 'rpx'
			},
			autoMoreSize() {
				return parseFloat(this.width) * 0.087 + 'rpx'
			},
			autoCloseSize() {
				return parseFloat(this.width) * 0.087 + 'rpx'
			}
		},
		props: {
			// 整体配置参数
			type: {
				type: String,
				default: 'hori-connect'
			},
			width: {
				type: [String, Number],
				default: uni.getSystemInfoSync().screenWidth
			},
			height: {
				type: [String, Number],
				default: 70
			},
			color: {
				type: String,
				default: '#f5a300'
			},
			bgColor: {
				type: String,
				default: ''
			},
			text: {
				type: Array,
				default () {
					return []
				}
			},
			fontWeight: {
				type: String,
				default: 'normal'
			},
			fontSize: {
				type: [String, Number],
				default: '27'
			},
			hasBorder: {
				type: Boolean,
				default: false,
			},
			scroll: {
				type: Boolean,
				default: true,
			},
			showIcon: {
				type: Boolean,
				default: true
			},
			showMore: {
				type: Boolean,
				default: true
			},
			showClose: {
				type: Boolean,
				default: false
			},
			url: {
				type: String,
				default: ''
			},
			extendMoreArea: {
				type: Boolean,
				default: false
			},
			// hori-connect配置参数
			join: {
				type: String,
				default: '    '
			},
			spaceConst: {
				type: Number,
				default: 0
			},
			speed: {
				type: Number,
				default: 40
			},
			// vert和hori-break配置参数
			time: {
				type: Number,
				default: 3000
			},
			duration: {
				type: Number,
				default: 1000
			}
		},
		mounted() {
			this.getRect('#text').then(res => {
				this.autoBoxWidth = (res.width + this.blockWidth) * 2
				this.animDur = parseFloat(res.width + this.blockWidth) / this.speed + 's'
			})
		},
		methods: {
			showMoreTap() {
				if (this.url) {
					uni.navigateTo({
						url: this.url,
						fail(msg) {
							console.log(msg)
						}
					})
				} else {
					this.$emit('showMore')
				}
			},
			showMoreExtendTap() {
				if (this.extendMoreArea) {
					this.showMoreTap()
				}
			},
			swpChange(e) {
				if (this.text.length > 2) {
					let current = e.detail.current
					if (current === 1) {
						this.swp.splice(0, 1, this.swp[2])
						this.swp.splice(2, 1)
					} else if (current === 0) {
						this.swp.splice(1, 1, this.swp[2])
						this.swp.splice(2, 1)
					}
					this.swp.push(this.text[this.textIdx])
					this.textIdx++
					if (this.textIdx === this.text.length - 1) this.textIdx = 0
				}
			},
			getRect(selector) {
				return new Promise(resolve => {
					uni.createSelectorQuery().in(this)['select'](selector).boundingClientRect(rect => {
						if (rect) resolve(rect)
					}).exec()
				})
			},
			RGBChange(color, level, type) {
				// hex转rgb
				if (color.length === 4) {
					let arr = color.split('')
					color = '#' + arr[1] + arr[1] + arr[2] + arr[2] + arr[3] + arr[3]
				}
				let color16List = [color.substring(1, 3), color.substring(3, 5), color.substring(5, 7)]
				let r = parseInt(color16List[0], 16)
				let g = parseInt(color16List[1], 16)
				let b = parseInt(color16List[2], 16)
				let rgbc = [r, g, b]
				// 减淡或加深
				for (var i = 0; i < 3; i++)
					type === 'light' ? rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]) : rgbc[i] = Math.floor(rgbc[i] * (1 -
						level))
				// rgb转hex
				let R = rgbc[0].toString(16)
				let G = rgbc[1].toString(16)
				let B = rgbc[2].toString(16)
				if (R.length === 1) R = '0' + R
				if (G.length === 1) G = '0' + G
				if (B.length === 1) B = '0' + B
				return '#' + R + G + B
			}
		}
	}
</script>

<style>
	@import "./iconfont.css";

	@keyframes hori-animation {
		0% {
			transform-origin: left;
			transform: translateX(0);
		}

		100% {
			transform-origin: left;
			transform: translateX(-50%);
		}
	}
	
	.base {
		
	}

	.container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		overflow: hidden;
	}

	.marquee-hori,
	.marquee-vert{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: clip;
		position: relative;
	}
	
	.marquee-vert {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}

	.box-hori {
		height: 100%;
		display: flex;
		flex-direction: row;
		animation-name: hori-animation;
		animation-duration: 5s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-delay: 1s;
		white-space: nowrap;
	}
	
	.box-vert {
		width: 100%;
		padding-bottom: 4rpx;
		display: flex;
		flex-direction: column;
		white-space: nowrap;
	}
	
	.swiper {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}
	
	.swiper-item {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}

	.close-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		overflow: hidden;
	}

	.notice-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		box-sizing: border-box;
		overflow: hidden;
		padding-left: 24rpx;
	}

	.look-more-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
