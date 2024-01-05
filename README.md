## oimi-tk

### Update Log

2024/1/4: ✨ 更新通过用户主页分享链接，批量下载作品

2024/1/5: ✨ 优化批量下载用户主页作品，支持图片作品下载。

### Vercel部署

> 由于Vercel的边缘函数默认的超时时间为6s,批量下载主页作品会多次请求作者的作品耗时比较长，会出现超时的问题（无法解决，只有购买vercel的付费版本）。


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/helson-lin/tk_no_water_node)

### API

`code`: 0: error happened, 1: sucess request
`/workflow`: is for ios workflow

| URL       | METHOD | PARAMS      | RESPONSE                                        |
| --------- | ------ | :---------- | ----------------------------------------------- |
| `/douyin`   | `POST`   | `{ url:  ""}` | `{ code: 0, data: {video: '', img: '', msg: ''}}` |
| `/workflow` | `POST`   | `{ url:  ""}` | `{ code: 0, data: ['downloadUrl'] }`              |
|           |        |             |                                                 |



捷径: [iCloud](https://www.icloud.com/shortcuts/f19925da427c41a5bad09f2bc169fedd)


### PS

本项目思路参考： [Doouyin_TikTOk_Download_API](https://github.com/Evil0ctal/Douyin_TikTok_Download_API), `X-Bogus.js`源自该项目


