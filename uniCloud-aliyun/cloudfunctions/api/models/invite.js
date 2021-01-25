const db = uniCloud.database();

var invite = {
    add: async (req) => {
		var inviteQuery = await db.collection('invite').where({
			openid: req.openid,
		}).get();
		if(inviteQuery.affectedDocs == 0){
			// 单条插入数据
			let res = db.collection('invite').add({
				inviteOpenid: req.inviteOpenid,
				openid: req.openid,
				id: req.id,
				dateStr: new Date().toLocaleString('zh', {hour12: false, timeZone: 'Asia/Shanghai'}),
			})
			return res
		}
		return
	},
}

module.exports = invite;
