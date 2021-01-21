const db = uniCloud.database();

var ad = {
    add: (req) => {
		// 单条插入数据
		let res = db.collection('ad').add({
			openid: req.openid,
			id: req.id,
			isEnded: req.isEnded,
			dateStr: new Date().toLocaleString('zh', {hour12: false, timeZone: 'Asia/Shanghai'}),
		})
		return res
	},
}

module.exports = ad;
