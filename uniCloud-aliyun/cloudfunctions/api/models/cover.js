const db = uniCloud.database();

var cover = {
    list: async () => {
		let list = await db.collection('cover').get();
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
	ads: async () => {
		let ads = await db.collection('config').where({
			name: "ad"
		}).get();
		return ads.data[0].value.detail
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

		//超额完成任务处理
		if (lookVideoLockNum > detail.data[0].lookVideoLockNum) {
			lookVideoLockNum = detail.data[0].lookVideoLockNum
		}
		if (inviteLockNum > detail.data[0].inviteLockNum) {
			inviteLockNum = detail.data[0].inviteLockNum
		}

		//已解锁创建领取记录
		if (isLocked) {
			let hasExistCoverCode = await db.collection('cover_code').where({
				coverId: req.id,
				bindOpenid: req.openid
			}).limit(1).get()
			if (hasExistCoverCode.affectedDocs == 0) {
				let ins_res = await db.collection('cover_code').add({
					coverId: req.id,
					code: "",
					bindOpenid: req.openid,
					useTime: new Date().toLocaleString('zh', {hour12: false, timeZone: 'Asia/Shanghai'}),
					isUse: true
				})
			}

			//附加openid
			detail.data[0].getDesc += "\n" + req.openid
		}

		//广告位配置
		let adConfig = await db.collection('config').where({
			name: "ad"
		}).get();
		let ad = adConfig.data[0].value.detail
		//详情页不显示插屏
		ad.one = ""

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
    view: async (req) => {
		let return_str = ""
		if (req.openid) {
			return_str = "openid:"+req.openid+"\n"
			let user_info = await db.collection('user').where({
				openid: req.openid,
			}).get();
			if(user_info.affectedDocs == 0){
				return_str += "用户信息不存在！注意伪造openid！\n"
			}
			let cover_code_list = await db.collection('cover_code').where({bindOpenid:req.openid}).field({'_id':true,'coverId':true,'code':true,'useTime':true}).get();
			if (cover_code_list.affectedDocs) {
				for (let cover_code of cover_code_list.data) {
					var adLookVideo = await db.collection('ad').where({
						openid: req.openid,
						id: cover_code.coverId,
						isEnded: "true",
					}).count()
					var invite = await db.collection('invite').where({
						inviteOpenid: req.openid,
						id: cover_code.coverId,
					}).count()
					return_str += "codeId:"+cover_code._id+" coverId:"+cover_code.coverId+" invite:"+invite.total+" ad:"+adLookVideo.total+" code:"+cover_code.code+" useTime:"+cover_code.useTime+"\n"
				}

			}

		}

		if (req.code && req.codeid) {
			await db.collection('cover_code').doc(req.codeid).update({
				code : req.code,
			})
			return_str += "update success\n"
		}

		return return_str
	},
}

module.exports = cover;
