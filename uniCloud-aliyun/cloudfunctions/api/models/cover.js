const db = uniCloud.database();

var cover = {
    list: async () => {
		let list = await db.collection('cover').orderBy("sort", "desc").get();
		return list.data
	},
	coupons: async () => {
		let coupons = await db.collection('coupon').orderBy("sort", "desc").get();
		return coupons.data
	},
	tips: async () => {
		let tips = await db.collection('config').where({
			name: "tips"
		}).get();
		return tips.data[0].value
	},
	detail: async (req) => {
		let detail = await db.collection('cover').doc(req.id).get();
		let adLookVideo = await db.collection('ad').where({
				openid: req.openid,
				id: req.id,
				isEnded: "true",
			}).count()
		let invite = await db.collection('invite').where({
				inviteOpenid: req.openid,
				id: req.id,
			}).count()
		let lookVideoLockNum = adLookVideo.total
		let inviteLockNum = invite.total
		if(detail.data[0].isFree || ((lookVideoLockNum > 0 && lookVideoLockNum >= detail.data[0].lookVideoLockNum) || (inviteLockNum > 0 && inviteLockNum >= detail.data[0].inviteLockNum))){
			var isLocked = true
		}else{
			var isLocked = false
		}
		//广告位配置
		let adConfig = await db.collection('config').where({
			name: "ad"
		}).get();
		let ad = adConfig.data[0].value.detail
		detail.data[0].getDesc += "\n" + req.openid
		return {
			coverDetail: detail.data[0],
			lockEdInfo: {
				lookVideoLockNum,
				inviteLockNum,
				isLocked,
			},
			ad,
		}
	},
}

module.exports = cover;
