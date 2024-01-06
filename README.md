## oimi-tk

### Update Log

2024/1/4: ✨ 更新通过用户主页分享链接，批量下载作品

2024/1/5: ✨ 优化批量下载用户主页作品，支持图片作品下载。

### 效果展示

<div style="display: flex;width: 100%;justify-content: center; ">
<video style="max-width: 750px;" src="https://file.helson-lin.cn/picgooimi_tk_docs.mp4" autoplay="true" muted="true"></video>
</div>

### 部署

#### Vercel部署

> 由于Vercel的边缘函数默认的超时时间为6s,批量下载主页作品会多次请求作者的作品耗时比较长，会出现超时的问题（无法解决，只有购买vercel的付费版本）。


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/helson-lin/tk_no_water_node)

#### 服务器手动部署

1. 从Release下载对应平台的可执行文件，到服务器。
2. 授权：`chmod +x excutablefilename` `${excutablefilename}`为对应的文件名称
3. `./oimi-tk-linux-x86`根据实际情况执行。

如果服务器和linux基础知识都不明白，不建议手动。

自定义端口：

创建一个`.env`文件在程序同级别目录， 添加如下内容

```js
PORT = 11233
```

或者通过命令行参数指定端口：`./oimi-tk-linux-x86 --port=2301`, 命令行权重最高。

#### Docker部署

1. 拉取镜像: `docker push h55205l/douyin_no_watermark:latest`,目前没有构建`arm`版本
2. 运行服务：`docker run -p 3311:3000 -d h55205l/douyin_no_watermark:latest`

内置默认端口为`3000`, 映射端口自行修改

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

