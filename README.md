<h2 align="center">douyin_no_watermark是一个抖音视频无水印下载程序 【2024/09/05 测试正常】</h2>
<p align="center">支持Docker、Vercel、私有化服务部署，支持IOS捷径快捷下载</p>
<p align="center">
    <a href="https://hub.docker.com/r/h55205l/ffandown">
        <img alt="docker image size" src="https://img.shields.io/docker/image-size/h55205l/douyin_no_watermark"/>
    </a>
    <a href="https://hub.docker.com/r/h55205l/douyin_no_watermark">
        <img alt="docker pulls" src="https://img.shields.io/docker/pulls/h55205l/douyin_no_watermark?style=social"/>
    </a>
    <a href="https://github.com/helson-lin/douyin_no_watermark">
          <img alt="release downloads" src="https://img.shields.io/github/downloads/helson-lin/douyin_no_watermark/total?color=brightgreen&label=release%20download"/>
    </a>
    <a href="https://github.com/helson-lin/douyin_no_watermark">
        <img alt="docker image size" src="https://img.shields.io/badge/platform-macos%7Clinux%7Cwin-brightgreen"/>
    </a>
     <a href="https://github.com/helson-lin/douyin_no_watermark">
        <img alt="docker image size" src="https://img.shields.io/github/last-commit/helson-lin/douyin_no_watermark"/>
    </a>
</p>

### Firt you should know


if the application have this error information: `FetchError: invalid json response body at https://www.douyin.com/aweme/v1/web/aweme/detail/?device_platform=webapp&aid=6383&channel=channel_pc_web&aweme_id=7366865544722550035&pc_client_type=1&version_code=190500&versio`

please replace the `bin/index.js` 16 line's cookie varible with yours.

you can get the cookie varible from `douyin` website, developer tool's application tab - `cookie` - `sid_guard`



### Update Log

2024/9/5: 🐛 修复 x_bogus 验证失败，转换为 a_bougs 参数。

2024/1/4: ✨ 更新通过用户主页分享链接，批量下载作品

2024/1/5: ✨ 优化批量下载用户主页作品，支持图片作品下载。

### 效果展示

[![预览](https://file.helson-lin.cn/picgoSnipaste_2024-01-06_18-33-54.png)](https://file.helson-lin.cn/picgooimi_tk_docs.mp4)



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

1. 拉取镜像: `docker pull h55205l/douyin_no_watermark:latest`,目前没有构建`arm`版本
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



**捷径下载**: [[iCloud](https://www.icloud.com/shortcuts/f42fea0e6fd14dcbae62921b8b758c7d)](https://www.icloud.com/shortcuts/163f1f35153c4c37a41b4f12c32288d1)

捷径内服务器，仅供测试使用。如果有大量使用需求，请自行部署。

推荐使用个人服务器部署，`vercel`部署批量下载或出现超时（单个作品下载不会），请谨记(付费版本除外)。



### PS

本项目思路参考： [Doouyin_TikTOk_Download_API](https://github.com/Evil0ctal/Douyin_TikTok_Download_API), `X-Bogus.js`源自该项目

