const config = require('config')
const db = uniCloud.database();

var login = async (code) => {
	let res = await getOpenid(code)
	console.log(res)
	var userQuery = await db.collection('user').where({
		openid: res.data.openid,
	}).get();
	console.log(userQuery)
	if(userQuery.affectedDocs == 0){
		var newUserQuery = await db.collection('user').add(res.data)
		var userQuery = await db.collection('user').doc(newUserQuery.id).get()
	}else{
		//更新  暂时不需要
	}
	var user = userQuery.data[0]
	return user
}

function getOpenid(code) {
	return uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
		method: 'GET',
		data: {
			appid: config.APPID, //你的小程序的APPID    
			secret: config.SECRET, //你的小程序的secret,    
			js_code: code //wx.login 登录成功后的code    
		},
		contentType: 'json', // 指定以application/json发送data内的数据
		dataType: 'json' // 指定返回值为json格式，自动进行parse
	})
}
module.exports = login;
