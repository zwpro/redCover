### 魔改版说明

#### 改进

- 封面详情页插屏广告移至首页（详情页想开可以自己开）需发版
- 用户超额完成任务处理（防止出现 33/10）需发版
- 增加用户完成情况查看与处理功能 无需发版，更新云函数即可
- 增加用户封面领取记录表 无需发版，更新云函数即可

#### 已知问题

- 由于网络抖动等原因领取记录表可能会出现重复数据，目测不影响
- 用户领取完成情况查看和处理从浏览器打开返回结果会当作json文件下载，curl无此问题（待大佬修复）

#### 使用说明

使用魔改版请在云数据库创建 `cover_code` 领取记录表。

用户完成情况查看与处理使用：

1.查看用户完成情况
```shell
$ curl https://{云空间spaceid}.bspapp.com/http/api/view?openid={用户openid}
openid:用户openid
codeId:领取id coverId:封面id invite:所邀请人数 ad:视频观看数 code:兑换码 useTime:领取时间
```

2.更新用户领取封面的兑换码或其它领取字样，标记该用户已领取此封面。防openid冒领。
```shell
$ curl https://{云空间spaceid}.bspapp.com/http/api/view?codeid={codeId}&code={兑换码或者其它已领取字样}
update success
```

### 微信红包封面领取小程序，用户观看视频广告或者邀请新用户可获取微信红包封面序列号，还可给外卖优惠券引流

封面红包魔改版1：https://github.com/SunJackson/red-cover

封面红包魔改版2：https://github.com/zyh94946/redCover

微信红包封面领取小程序

<img src="https://raw.githubusercontent.com/zwpro/redCover/master/unpackage/cover1.png" width="30%"/> <img src="https://raw.githubusercontent.com/zwpro/redCover/master/unpackage/cover2.jpg" width="30%"/> <img src="https://raw.githubusercontent.com/zwpro/redCover/master/unpackage/cover3.png" width="30%"/>

### 使用方法

源码为uniapp项目，需下载hbuilder导入项目打包，编译成小程序

[在线文档](http://lianghua.wxthe.com/docs/)

### 常见问题

1.封面配置（待整理）

2.广告位配置（待整理）

3.优惠券配置（待整理）

另附：[外卖CPS红包小程序](https://github.com/zwpro/coupons)

如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励 ❤️

<img src="http://cdn.letwind.com/me/zanshang.jpg" width="200"/>

如有问题疑惑，赞赏时可留下你微信，会添加你解答
